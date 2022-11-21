// const express = require('express');
// const sql = require('mysql');
// const moment = require('moment');

import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import * as sv from "../server.js";

export const router = express.Router();

const checkCustomerExists = async (customerId) => {
    let result = false;

    customerId = parseInt(customerId);
    if (typeof customerId !== "number") {
        console.log(
            `Customer ID is not a number: typeof ${customerId} = ${typeof customerId}`
        );
        return false;
    }

    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query(
            "SELECT customerId FROM customer WHERE customerId = ?;",
            [customerId]
        );
        pool.end();
        result = rows.length > 0;
    } catch (err) {
        console.error(`Error loading customer table: ${err}`);
    }

    return result;
};

/**
 * Method to get the current order ID from the database with MySQL
 */
const getCurrentOrderId = async (pool) => {
    let result = -1;
    try {
        if (!pool) {
            let pool = await sql.createPool(sv.dbPoolConfig);
        }
        let [rows, fields] = await pool.query(
            "SELECT orderId + 1 AS nextId FROM ordersummary ORDER BY orderId DESC LIMIT 1;"
        );
        result = rows[0].nextId;
    } catch (err) {
        console.error(
            `Error loading AUTO_INCREMENT from database "shopdb": ${err}`
        );
    }
    return result;
};

const saveOrderSummaryToDB = async (order, pool = null) => {
    let results = [];

    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query(
            "INSERT INTO ordersummary (orderDate, totalAmount, customerId) VALUES (?, ?, ?);",
            [order.orderDate, order.totalAmount, order.customerId]
        );
        pool.end();
        results = rows;
    } catch (err) {
        console.error(`Error loading ordersummary table: ${err}`);
    }
    return results;
};

const saveOrderProductsToDB = async (orderId, products, pool = null) => {
    let results = [];

    // Remove null values
    let nullIdx = -1;
    while ((nullIdx = products.indexOf(null)) > -1) {
        products.splice(nullIdx, 1);
    }

    try {
        let pool = await sql.createPool(sv.dbPoolConfig);

        for (let p of products) {
            if (p) {
                // console.log(`${orderId}: ${JSON.stringify(p)}`);
                let [rows, fields] = await pool.query(
                    "INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (?, ?, ?, ?);",
                    [orderId, p.id, p.quantity, p.price]
                );
                results.push(rows);
            }
        }
        pool.end();
    } catch (err) {
        console.error(`Error loading orderproduct table: ${err}`);
    }

    return results;
};

const buildSummaryTable = (orderId, order, products) => {
    // Show order details
    let page = "";
    page += `<h2>Customer ID: ${order.customerId}</h2>`;
    page += `<h2>Order ID: ${orderId}</h2>`;
    page += `<h2>Order Date: ${order.orderDate}</h2>`;

    page += `<table class="table">`;
    page += `<thead>`;
    page += `<tr><th class="hcell">ID</th><th class="hcell">Product</th><th class="hcell">Quantity</th><th class="hcell">Price</th></tr>`;
    page += `</thead>`;
    page += `<tbody>`;

    for (let p of products) {
        if (p) {
            page += `<tr>`;
            page += `<td class="cell">${p.id}</td>`;
            page += `<td class="cell">${p.name}</td>`;
            page += `<td class="cell">${p.quantity}</td>`;
            page += `<td class="cell">${sv.PRICE_FORMATTER.format(
                p.price
            )}</td>`;
            page += `</tr>`;
        }
    }
    page += `<tr><td class="cell t-right" colspan="3"><strong>Order Total:</strong></td><td class="cell"><strong>${sv.PRICE_FORMATTER.format(
        order.totalAmount
    )}</strong></td></tr>`;
    page += `</tbody>`;
    page += `</table>`;
    return page;
};

const saveOrderToDB = async (order, products) => {
    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let orderId = await getCurrentOrderId(pool);
        await saveOrderSummaryToDB(order, pool);
        await saveOrderProductsToDB(orderId, products, pool);
        pool.end();
        return buildSummaryTable(orderId, order, products);
    } catch (err) {
        console.error(`Error saving order to database: ${err}`);
    }
    return `<h2>Order could not be saved to database</h2>`;
};

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write(`<title>${sv.STORE_TITLE} Order Processing</title>`);
    res.write(`<link rel="stylesheet" href="/css/style.css">`);

    let productList = false;
    if (req.session.productList && req.session.productList.length > 0) {
        productList = req.session.productList;
    }

    res.write(`<div class="container">`);
    let page = "<h1>Order Processing</h1>";
    /**
    Determine if valid customer id was entered
    Determine if there are products in the shopping cart
    If either are not true, display an error message
    **/
    let customerId = req.query.customerId;

    // Validate info first
    checkCustomerExists(customerId)
        .then((result) => {
            result = result && productList;

            if (result) {
                // Prepare order object
                let order = {
                    orderDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                    totalAmount: 0.0,
                    customerId: customerId,
                };
                for (let p of productList) {
                    if (p) order.totalAmount += p.price * p.quantity;
                }
                // Save order to database
                saveOrderToDB(order, productList).then((table) => {
                    page += table;

                    page += `<h2>Thank you for your order! <a href="/">Return home.</a></h2>`;

                    // Clear session cart
                    req.session.productList = [];
                    res.write(page);
                    res.write(`</div>`);
                    res.end();
                });
            } else if (!productList) {
                page += `<h1>No Products in Cart</h1>`;
                page += "<h2><a href='/showcart'>Back to Cart</a></h2>";
                res.write(page);
                res.write(`</div>`);
                res.end();
            } else {
                page += `<h1>Invalid Customer ID</h1>`;
                page += "<h2><a href='/showcart'>Back to Cart</a></h2>";
                res.write(page);
                res.write(`</div>`);
                res.end();
            }
        })
        .catch((err) => {
            console.error(`Error checking customer: ${err}`);
            res.status(500).end();
        });

    /** Make connection and validate **/

    /** Save order information to database**/

    /**
        // Use retrieval of auto-generated keys.
        sqlQuery = "INSERT INTO <TABLE> OUTPUT INSERTED.orderId VALUES( ... )";
        let result = await pool.request()
            .input(...)
            .query(sqlQuery);
        // Catch errors generated by the query
        let orderId = result.recordset[0].orderId;
        **/

    /** Insert each item into OrderedProduct table using OrderId from previous INSERT **/

    /** Update total amount for order record **/

    /** For each entry in the productList is an array with key values: id, name, quantity, price **/

    /**
        for (let i = 0; i < productList.length; i++) {
            let product = products[i];
            if (!product) {
                continue;
            }
            // Use product.id, product.name, product.quantity, and product.price here
        }
    **/

    /** Print out order summary **/

    /** Clear session/cart **/

    // res.write(page);
    // res.write(`</div>`);
});

export default router;
// module.exports = router;
