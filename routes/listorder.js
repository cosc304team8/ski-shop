// const express = require("express");
// const sql = require("mysql2");
// const moment = require("moment");
// const sv = require("../server");

import express from "express";
import sql from "mysql2";
import moment from "moment";
import * as sv from "../server.js";

export const router = express.Router();

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write(`<title>${req.app.get("storeName")} Grocery Order List</title>`);

    /** Create connection, and validate that it connected successfully **/
    try {
        let con = sql.createConnection(req.app.get("dbConfig"));
    } catch (err) {
        console.log(err);
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

    res.end();
});

export default router;
// module.exports = router;
