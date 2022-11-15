// const express = require('express');
// const sql = require('mysql');

import express from "express";
import sql from "mysql2";

export const router = express.Router();

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write("<title>YOUR NAME Grocery</title>");

    // Get the product name to search for
    let name = req.query.productName;

    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/

    /** Create and validate connection **/

    /** Print out the ResultSet **/

    /** 
    For each product create a link of the form
    addcart?id=<productId>&name=<productName>&price=<productPrice>
    **/

    /**
        Useful code for formatting currency:
        let num = 2.89999;
        num = num.toFixed(2);
    **/

    res.end();
});

export default router;
// module.exports = router;
