// const express = require("express");
import express from "express";

export const router = express.Router();

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    // If the product list isn't set in the session,
    // create a new list.
    let productList = false;
    if (!req.session.productList) {
        productList = [];
    } else {
        productList = req.session.productList;
    }

    // Add new product selected
    // Get product information
    let id = false;
    let name = false;
    let price = false;
    if (req.query.id && req.query.name && req.query.price) {
        id = req.query.id;
        name = req.query.name;
        price = req.query.price;
    } else {
        res.redirect("/listprod");
    }

    // Update quantity if add same item to order again
    let qty = req.query.quantity ? req.query.quantity : 1;
    if (productList[id]) {
        productList[id].quantity = productList[id].quantity + qty;
    } else {
        productList[id] = {
            id: id,
            name: name,
            price: price,
            quantity: qty,
        };
    }

    req.session.productList = productList;
    res.redirect("/showcart");
});

export default router;
// module.exports = router;
