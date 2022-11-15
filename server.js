// const express = require("express");
// const exphbs = require("express-handlebars");
// const session = require("express-session");

// let loadData = require("./routes/loaddata");
// let listOrder = require("./routes/listorder");
// let listProd = require("./routes/listprod");
// let addCart = require("./routes/addcart");
// let showCart = require("./routes/showcart");
// let checkout = require("./routes/checkout");
// let order = require("./routes/order");

import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";

import * as loadData from "./routes/loaddata.js";
import * as listOrder from "./routes/listorder.js";
import * as listProd from "./routes/listprod.js";
import * as addCart from "./routes/addcart.js";

import * as showCart from "./routes/showcart.js";
import * as checkout from "./routes/checkout.js";
import * as order from "./routes/order.js";

export const app = express();

/**
 * Global Variables
 */
const STORE_TITLE = "Kelowna Alpine";

// This DB Config is accessible globally
export const dbConfig = {
    host: "localhost",
    user: "root",
    password: "304rootpw",
    database: "shopdb",
};

// Setting up the session.
// This uses MemoryStorage which is not
// recommended for production use.
app.use(
    session({
        secret: "COSC 304 smells (good)",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 60000,
        },
    })
);

// Setting up the rendering engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Set up middleware and variables
app.set("storeName", STORE_TITLE);
app.set("dbConfig", dbConfig);

// Setting up Express.js routes.
// These present a "route" on the URL of the site.
// Eg: http://127.0.0.1/loaddata
app.use("/loaddata", loadData.router);
app.use("/listorder", listOrder.router);
app.use("/listprod", listProd.router);
app.use("/addcart", addCart.router);
app.use("/showcart", showCart.router);
app.use("/checkout", checkout.router);
app.use("/order", order.router);

// Rendering the main page
app.get("/", function (req, res) {
    res.render("index", {
        title: STORE_TITLE,
    });
});

// Starting our Express app
app.listen(3000);

// module.exports = app;
