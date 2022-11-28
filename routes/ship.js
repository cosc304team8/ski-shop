import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import * as sv from "../server.js";
import { checkAuthentication } from "../auth.js";

export const router = express.Router();

/*
    Get products from order
*/
const orderProductsById = async (conn, orderId, warehouse = 0) => {
    let shipment = [];
    try {
        let q = "SELECT * FROM orderproduct WHERE orderId = ?";
        let [rows, fields] = await conn.execute(q, [orderId]);
        let products = [];
        if (rows.length > 0) products = [...rows];

        let numProducts = 0;
        for (let p of products) {
            let { w, qty } = await checkWarehouseQuantity(conn, p.productId, p.quantity, warehouse);
            let shipped = await updateWarehouseQuantity(conn, warehouse, p.productId, qty - p.quantity);
            shipment.push({
                warehouseId: w,
                productId: p.productId,
                inventory: qty,
                quantity: p.quantity,
                shipped,
            });

            // only ship 3 products
            if (++numProducts > 3) break;
        }
    } catch (err) {
        throw new Error(`orderProductById: ${err}`);
    }
    return shipment;
};

/*
    Check if any warehouse has enough quantity to ship
*/
const checkWarehouseQuantity = async (conn, productId, orderQty, warehouseId = 0) => {
    let q = "SELECT warehouseId, quantity FROM productinventory WHERE productId = ?";
    let v = [productId];

    if (warehouseId) {
        q = "SELECT warehouseId, quantity FROM productinventory WHERE productId = ? AND warehouseId = ?";
        v = [productId, warehouseId];
    }

    let [rows, fields] = await conn.execute(q, v);

    // Get product from first available warehouse
    if (rows.length > 0) {
        let products = [...rows];
        let warehouse = products[0].warehouseId;

        let qty = products[0].quantity;

        // If warehouse has none of the item, check the others
        while (qty === 0) {
            products.shift();
            if (products.length === 0) throw new Error(`No quantity found for productId: ${productId}`);

            warehouse = products[0].warehouseId;
            qty = products[0].quantity;
        }

        if (qty >= orderQty) {
            return { w: warehouse, qty };
        } else {
            throw new Error(`Not enough quantity in warehouse for productId: ${productId} (x${orderQty} > x${qty})`);
        }
    } else throw new Error(`No warehouse with product: ${productId}`);
    return false;
};

/*
    Update quantity in given warehouse
*/
const updateWarehouseQuantity = async (conn, warehouseId, productId, qty) => {
    let q = "UPDATE productinventory SET quantity = ? WHERE warehouseId = ? AND productId = ?";
    let [rows, fields] = await conn.execute(q, [qty, warehouseId, productId]);

    if (rows.affectedRows === 1) return true;
    else return false;
};

/*
 Check if order exists
 */
const validateOrderId = async (orderId) => {
    if (orderId === undefined) return false;

    let pool = await sql.createPool(sv.dbPoolConfig);
    let found = false;

    try {
        let q = "SELECT orderId FROM ordersummary WHERE orderId = ?";
        let [rows, fields] = await pool.query(q, [orderId]);

        if (rows.length > 0) found = true;
    } catch (err) {
        throw new Error(`validateOrderId: ${err}`);
    }
    return { pool, found };
};

/*
    Insert shipment record
*/

const insertShipmentRecord = async (desc, warehouseId) => {
    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let q = "INSERT INTO shipment (shipmentDate, shipmentDesc, warehouseId) VALUES (NOW(), ?, ?)";
        let [rows, fields] = await pool.query(q, [desc, warehouseId]);
        pool.end();

        if (rows.affectedRows === 1) return true;
    } catch (err) {
        throw new Error(`insertShipmentRecord: ${err}`);
    }
    return false;
};

/*
    Process all queries
*/
const createShipStatement = async (orderId) => {
    let stmt = "";
    let { pool, found } = await validateOrderId(orderId);
    if (!found) {
        return `<p class="error">Order ${orderId} not found</p>`;
    }
    let conn = await pool.getConnection();
    let orderDetails = [];

    try {
        await conn.beginTransaction();
        orderDetails = await orderProductsById(conn, orderId, 1);
        await conn.commit();
        await pool.end();

        if (orderDetails.length > 0) {
            let record = [];

            stmt += `<ol class="shiplist">`;
            let numOrders = 0;
            for (let order of orderDetails) {
                stmt += `<li>Ordered <code class="code">${order.quantity}</code> of <code class="code">Product #${
                    order.productId
                }</code> from <code class="code">Warehouse #${
                    order.warehouseId
                }</code><br/>Previous inventory: <code class="code">${
                    order.inventory
                }</code>, New inventory: <code class="code">${order.inventory - order.quantity}</code></li>`;

                record.push(`(prod ${order.productId} x${order.quantity})`);

                if (++numOrders > 3) break;
            }

            stmt += "</ol>";
            stmt += "<h3>Order processed successfully</h3>";

            // Insert shipment record
            let desc = `Order ${orderId}: ${record.join(", ")}`;
            let success = await insertShipmentRecord(desc, 1);
        }
    } catch (err) {
        console.log(`Error in createShipStatement: ${err}`);
        if (conn) await conn.rollback();
        if (pool) pool.end();
        stmt = `<p class="error">Error: ${err}</p>`;
    } finally {
        await conn.release();
    }
    return stmt;
};

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");

    // TODO: Get order id
    let orderId = req.query.orderId;

    if (orderId) {
        // TODO: Check if valid order id
        createShipStatement(orderId).then((stmt) => {
            res.render("template", {
                title: "Ship Order",
                pageTitle: `Shipping Order ${orderId}...`,
                content: stmt,
            });
        });
    } else {
        res.render("template", {
            title: "Ship Order",
            pageTitle: `No order id provided`,
        });
    }
});
