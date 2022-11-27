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

// Export file paths
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const app = express();
const { engine } = exphb;

// Enable parsing of requests for POST requests
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
export const tableFromResults = (results, cols) => {
    let table = `<table class="table">`;
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
            maxAge: 300000, // 5 minutes
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
app.use("/product", product.router);
app.use("/displayImage", displayImage.router);
app.use("/login", login.router);
app.use("/logout", logout.router);
app.use("/admin", admin.router);
app.use("/validateLogin", validateLogin.router);
app.use("/customer", customer.router);
app.use("/stock", stockWarehouse.router);
app.use("/ship", shipment.router);

// Rendering the main page
app.get("/", function (req, res) {
    // console.log(`authenticatedUser: ${req.session.authenticatedUser}`);
    res.render("index", {
        title: "Home",
        pageTitle: "Kelowna Alpine",
        storeName: STORE_TITLE,
        authenticatedUser: req.session.authenticatedUser,
    });
});

// Starting our Express app
app.listen(3000);

// module.exports = app;
