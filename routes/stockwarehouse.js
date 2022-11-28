import express from "express";
import sql from "mysql2/promise";
import { checkAuthentication } from "../auth.js";
import * as sv from "../server.js";

export const router = express.Router();

const WAREHOUSE_NAMES = ["Huntington Beach", "Irvine", "San Diego", "San Francisco", "Seattle"];

/*
    Utility functions
*/

const shuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/*
    Warehouse functions
*/

const prepareWarehouses = async () => {
    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let q = "INSERT INTO warehouse (warehouseName) VALUES ?";
        let names = shuffle([...WAREHOUSE_NAMES]);

        for (let n of names) {
            let [rows] = await pool.query(q, [[[n]]]);
        }
        pool.end();
        return true;
    } catch (err) {
        console.log(`Error in prepareWarehouses: ${err}`);
    }
    return false;
};

const populateAllWarehouses = async (products) => {
    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let [rows] = await pool.query("SELECT warehouseId FROM warehouse;");
        let warehouses = [...rows];

        if (products.length > 0 && warehouses.length > 0) {
            if (warehouses.length > 0) {
                // For each warehouse, add a random number of every product
                for (let p of products) {
                    for (let w of warehouses) {
                        let [rows] = await pool.query(
                            "SELECT productId FROM productinventory WHERE productId = ? AND warehouseId = ?;",
                            [p.productId, w.warehouseId]
                        );

                        if (rows.length > 0) {
                            let q =
                                "UPDATE productinventory SET quantity = ?, price = ? WHERE warehouseId = ? AND productId = ?;";
                            [rows] = await pool.query(q, [
                                getRandomInt(1, 100),
                                parseFloat(p.productPrice),
                                w.warehouseId,
                                p.productId,
                            ]);
                        } else {
                            let q = "INSERT INTO productinventory (warehouseId, productId, quantity, price) VALUES ?";
                            [rows] = await pool.query(q, [
                                [[w.warehouseid, p.productId, getRandomInt(1, 100), parseFloat(p.productPrice)]],
                            ]);
                        }
                    }
                }

                return true;
            }
        }
    } catch (err) {
        console.log(`Error in populateAllWarehouses: ${err}`);
    }
    return false;
};

const prepareWarehouseInventory = async (allProducts = false) => {
    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let q = "SELECT productId, productPrice FROM product";
        let [rows, fields] = await pool.query(q);

        let products = rows;

        return await populateAllWarehouses(products);
    } catch (err) {
        console.log(`Error in prepareWarehouseInventory: ${err}`);
    }
    return false;
};

const stockWarehouse = async () => {
    let content = "";
    if (await prepareWarehouses()) {
        content += `<p>Warehouses prepared succesfully!</p>`;

        if (await prepareWarehouseInventory(true)) {
            content += `<p>Warehouse inventory prepared succesfully!</p>`;
        } else {
            content += `<p class="error">Failed to prepare warehouse inventory.</p>`;
        }
    } else {
        content += `<p class="error">Failed to prepare warehouses.</p>`;
    }
    return content;
};

router.get("/", (req, res) => {
    let authenticated = checkAuthentication(req, res);

    if (authenticated) {
        stockWarehouse().then((result) => {
            let content = result;

            res.render("template", {
                title: "Stock Warehouse",
                pageTitle: "Restock Warehouses",
                content,
            });
        });
    } else {
        res.end();
    }
});
