// const express = require('express');
// const sql = require('mysql');
// const moment = require('moment');

import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import * as sv from "../server.js";
import { checkAuthentication } from "../auth.js";

export const router = express.Router();

const checkCustomerExists = async (customerId) => {
    let result = false;

    customerId = parseInt(customerId);
    if (isNaN(customerId)) {
        console.log(`Customer ID is NaN: typeof customerId = ${typeof customerId}`);
        result = false;
    } else {
        try {
            let pool = await sql.createPool(sv.dbPoolConfig);
            let [rows, fields] = await pool.query("SELECT customerId FROM customer WHERE customerId = ?;", [
                customerId,
            ]);
            pool.end();
            result = rows.length > 0;
        } catch (err) {
            console.error(`Error loading customer table: ${err}`);
        }
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
        console.error(`Error loading AUTO_INCREMENT from database "shopdb": ${err}`);
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
            page += `<td class="cell">${sv.PRICE_FORMATTER.format(p.price)}</td>`;
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

router.use("/", (req, res) => {
    let content = "";

    let authenticated = checkAuthentication(req, res);

    let productList = false;
    if (req.session.productList && req.session.productList.length > 0) {
        productList = req.session.productList;
    }

    let customerId = req.query.customerId;
    if (!customerId) {
        customerId = req.session.authenticatedUser.customerId;
    }

    console.log(JSON.stringify(req.session));

    // Validate info first
    checkCustomerExists(customerId).then((exists) => {
        if (exists && productList) {
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
                content += `<h2>Order Successful</h2>`;
                content += table;

                content += `<h2>Thank you for your order! <span class="link"><a href="/">Return home.</a></span></h2>`;

                // Clear session cart
                delete req.session.productList;
                // content += content;
                res.render("template", { title: "Order", content });
            });
            return;
            // break out of promise chain
        } else if (!exists) {
            content += `<h2>Invalid Customer ID: ${customerId}</h2>`;
            content += `<h3><span class="link"><a href="/showcart">Back to Cart</a></span></h3>`;
        } else if (!productList) {
            content += `<h2>No Products in Cart</h2>`;
            content += `<h3><span class="link"><a href="/showcart">Back to Cart</a></span></h3>`;
        }
        res.render("template", { title: "Order", content });
    });
});

export default router;
