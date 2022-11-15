// const express = require("express");
// const sql = require("mysql2");
// const moment = require("moment");
// const sv = require("../server");

import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import * as sv from "../server.js";

export const router = express.Router();

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write(`<title>${sv.STORE_TITLE} Grocery Order List</title>`);
    res.write(`<link rel="stylesheet" href="/css/style.css">`);

    /** Create connection, and validate that it connected successfully **/
    try {
        res.write("<h1>Orders</h1>");
        let query = "SELECT * FROM ordersummary;";
        sv.tableFromQuery(query, res).then(() => res.end());
    } catch (err) {
        console.log(`Error in listorder.js: ${err}`);
        res.status(500).end();
    }
    /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

    /** Write query to retrieve all order headers **/

    /** For each order in the results
            Print out the order header information
            Write a query to retrieve the products in the order

            For each product in the order
                Write out product information 
    **/
});

export default router;
// module.exports = router;
