import express from "express";
import exphb from "express-handlebars";
import session from "express-session";
import sql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

import * as loadData from "./routes/loaddata.js";
import * as listOrder from "./routes/listorder.js";
import * as listProd from "./routes/listprod.js";
import * as addCart from "./routes/addcart.js";
import * as showCart from "./routes/showcart.js";
import * as checkout from "./routes/checkout.js";
import * as order from "./routes/order.js";
import * as clearData from "./routes/cleardata.js";

// Lab 8
import bodyParser from "body-parser";
import * as product from "./routes/product.js";
import * as displayImage from "./routes/displayImage.js";
import * as login from "./routes/login.js";
import * as validateLogin from "./routes/validateLogin.js";
import * as admin from "./routes/admin.js";
import * as logout from "./routes/logout.js";
import * as customer from "./routes/customer.js";
import * as stockWarehouse from "./routes/stockwarehouse.js";
import * as shipment from "./routes/ship.js";
import * as index from "./routes/index.js";
import * as upload from "./routes/upload.js";
import bb from "express-busboy";

// Lab 10
import * as administrator from "./routes/administrator/index.js";
import * as addproduct from "./routes/administrator/addproduct.js";
import * as deleteproduct from "./routes/administrator/deleteproduct.js";

// Export file paths
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const app = express();
const { engine } = exphb;

// Utilities
export const asPrice = (val) => {
    return PRICE_FORMATTER.format(val);
};

// File handling for images
const bbOptions = {
    upload: true,
    path: "./public/img/",
    alloqwedPath: /^\/upload$/,
    mimeTypeList: ["image/png", "image/jpg", "image/jpeg"],
};
bb.extend(app, bbOptions);

// Enable parsing of requests for POST requests
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Global Variables
 */
export const STORE_TITLE = "Kelowna Alpine";
export const PRICE_FORMATTER = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
});

// This DB Config is accessible globally
export const dbConfig = {
    host: "157.230.69.100",
    user: "root",
    password: "N4MTeCeK56zHW9nBEkf3LQKP",
    database: "alpine",
};

export const dbPoolConfig = {
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Setting up the session.
// This uses MemoryStorage which is not
// recommended for production use.
app.use(
    session({
        secret: "COSC 304 smells (good)",
        resave: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 1 * 60 * 60 * 1000, // 1 hour * 60 minutes * 60 seconds * 1000 milliseconds
        },
    })
);

// Setting up the rendering engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// Set up middleware and variables
// app.set("storeName", STORE_TITLE);
// app.set("dbConfig", dbConfig);

// Set up static files
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

// Lab 8
app.use("/", index.router);
app.use("/product", product.router);
app.use("/displayImage", displayImage.router);
app.use("/login", login.router);
app.use("/logout", logout.router);
app.use("/admin", admin.router);
app.use("/validateLogin", validateLogin.router);
app.use("/customer", customer.router);
app.use("/stock", stockWarehouse.router);
app.use("/ship", shipment.router);
app.use("/upload", upload.router);

// Lab 10
app.use("/administrator", administrator.router);
app.use("/addproduct", addproduct.router);
app.use("/deleteproduct", deleteproduct.router);

// Starting our Express app
app.listen(3000);

/**
 * HTML Table Generator for MySQL
 */
export const tableFromResults = (results, cols) => {
    let table = `<table class="table rounded">`;
    for (let i = 0; i < results.length; i++) {
        let r = results[i];
        let keys = Object.keys(r);

        if (i === 0) {
            table += "<tr>";
            // Use cols if provided
            for (let k of cols ? cols : keys) {
                table += `<th class="hcell">${k}</th>`;
            }
            table += "</tr>";
        }

        table += "<tr>";
        for (let k of keys) {
            let value = r[k];
            if (k.toUpperCase().indexOf("PRICE") > -1 || k.toUpperCase().indexOf("$"))
                value = PRICE_FORMATTER.format(r[k]);

            table += `<td class="cell">${value}</td>`;
        }

        table += "</tr>";
    }
    table += "</table>";
    return table;
};

export const tableFromQuery = async (query, res) => {
    const conn = await sql.createPool(dbPoolConfig);

    let [rows] = await conn.query(query);

    tableFromResults(rows, res);
};
