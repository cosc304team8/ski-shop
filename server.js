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
import exphb from "express-handlebars";
import session from "express-session";
import sql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as loadData from "./routes/loaddata.js";
import * as listOrder from "./routes/listorder.js";
import * as listProd from "./routes/listprod.js";
import * as addCart from "./routes/addcart.js";
import * as showCart from "./routes/showcart.js";
import * as checkout from "./routes/checkout.js";
import * as order from "./routes/order.js";
import * as clearData from "./routes/cleardata.js";

export const app = express();
const { engine } = exphb;

/**
 * Global Variables
 */
export const STORE_TITLE = "Kelowna Alpine";

// This DB Config is accessible globally
export const dbConfig = {
    host: "host.docker.internal",
    user: "root",
    password: "304rootpw",
    database: "shopdb",
};

export const dbPoolConfig = {
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

/**
 * HTML Table Generator for MySQL
 */
export const tableFromQuery = async (query, res) => {
    const conn = await sql.createPool(dbPoolConfig);

    let [rows] = await conn.query(query);
    let out = [];

    res.write("<table>");
    for (let i = 0; i < rows.length; i++) {
        let r = rows[i];
        let keys = Object.keys(r);

        if (i === 0) {
            res.write("<tr>");
            for (let k of keys) {
                res.write(`<th>${k}</th>`);
            }
            res.write("</tr>");
        }

        res.write("<tr>");
        // console.log(`r = ${r}`);
        for (let k of keys) {
            // console.log(`\t${k} = ${r[k]}`);
            res.write(`<td>${r[k]}</td>`);
        }
        res.write("</tr>");
        // console.log(r, keys);
        // res.write(
        //     `<p>${JSON.stringify(r, null, 4).replace(/\n/g, "<br/>")}</p>`
        // );
    }

    res.write("</table>");
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
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// Set up middleware and variables
// app.set("storeName", STORE_TITLE);
// app.set("dbConfig", dbConfig);

// Set up CSS
app.use(express.static(path.join(__dirname, "public")));

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
app.use("/cleardata", clearData.router);

// Rendering the main page
app.get("/", function (req, res) {
    res.render("index", {
        title: STORE_TITLE,
    });
});

// Starting our Express app
app.listen(3000);

// module.exports = app;
