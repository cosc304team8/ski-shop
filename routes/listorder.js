import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import * as sv from "../server.js";

export const router = express.Router();

const getListOfOrders = async (orderId = null) => {
    let results = [];

    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query(
            `SELECT orderId, orderDate, totalAmount, (SELECT CONCAT(firstName, ' ', lastName) FROM customer WHERE customerId = ordersummary.customerId) AS customerName FROM ordersummary${
                orderId ? ` WHERE orderId = ${orderId}` : ""
            };`
        );
        pool.end();
        results = rows;
    } catch (err) {
        console.error(`Error loading orders database: ${err}`);
    }

    return results;
};

const getProductInfo = async (orderId) => {
    let prods = [];

    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query(
            "SELECT (SELECT productName FROM product WHERE productId = R.productId) AS name, quantity, (SELECT productDesc FROM product WHERE productId = R.productId) AS productDesc, price, (price * quantity) AS totalPrice FROM orderproduct R WHERE orderId = ?;",
            [orderId]
        );
        pool.end();
        prods = rows;
    } catch (err) {
        console.error(`Error loading products database: ${err}`);
    }
    return prods;
};

const buildOrderTable = async (orders) => {
    if (orders.length === 0) {
        return "<h2>No orders found.</h2>";
    }
    let table = `<table class="table">`;
    // Header row
    table += "<thead>";
    table += "<tr>";
    table += `<th class="hcell">ID</th>`;
    table += `<th class="hcell">Order Date</th>`;
    table += `<th class="hcell">Customer Name</th>`;
    table += `<th class="hcell">Price</th>`;
    table += `<th class="hcell">Qty</th>`;
    table += `<th class="hcell">Total Price</th>`;
    table += "</tr>";
    table += "</thead>";

    // populate with orders
    table += "<tbody>";
    for (let o of orders) {
        table += "<tr>";
        table += `<th class="hcell"><a href="/listorder?id=${o.orderId}">${o.orderId}</a></button></th>`;
        table += `<th class="hcell">${moment(o.orderDate).format("MMM Do YYYY")}</th>`;
        table += `<th class="hcell">${o.customerName}</th>`;
        table += `<th class="hcell"></th>`;
        table += `<th class="hcell"></th>`;
        table += `<th class="hcell">${sv.PRICE_FORMATTER.format(o.totalAmount)}</th>`;
        table += "</tr>";
        for (let p of await getProductInfo(o.orderId)) {
            table += "<tr>";
            table += `<td class="cell"></td>`;
            table += `<td class="cell">${p.name}</td>`;
            table += `<td class="cell">${p.productDesc}</td>`;
            table += `<td class="cell">${sv.PRICE_FORMATTER.format(p.price)}</td>`;
            table += `<td class="cell">${p.quantity}</td>`;
            table += `<td class="cell">${sv.PRICE_FORMATTER.format(p.totalPrice)}</td>`;
            table += "</tr>";
        }
    }
    table += "</tbody>";
    table += `</table>`;
    return table;
};

router.use("/", (req, res) => {
    let content = "";

    let orderId = req.query.id;

    getListOfOrders(orderId).then((orders) => {
        buildOrderTable(orders).then((table) => {
            content += table;

            res.render("template", {
                title: "Orders",
                pageTitle: "Orders",
                content,
            });
        });
    });
});

export default router;
// module.exports = router;
