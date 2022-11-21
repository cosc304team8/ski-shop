import express from "express";
import sql from "mysql2/promise";
import * as sv from "../server.js";

export const router = express.Router();

const getListOfProducts = async (name) => {
    let results = [];
    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query(
            "SELECT productId, productName, productPrice, productDesc, (SELECT categoryName FROM category WHERE categoryId = product.categoryId) AS productCategory FROM product WHERE productName LIKE ?",
            [`%${name}%`]
        );
        pool.end();
        results = rows;
    } catch (err) {
        console.error(`Error loading products database: ${err}`);
    } finally {
        return results;
    }
};

// Returns a string of HTML based on input table
const createProductTable = (products, cols) => {
    let keys = Object.keys(products[0]);
    let table = `<table class="table">`;
    // Header row
    table += "<tr>";
    table += `<th class="hcell">+</th>`;
    for (let k of cols ? cols : keys) table += `<th class="hcell">${k}</th>`;

    // Data rows
    table += "</tr>";
    for (let p of products) {
        table += "<tr>";
        table += `<td class="cell"><a href="/addcart?id=${p.productId}&name=${p.productName}&price=${p.productPrice}">Add to cart</a></button></td>`;
        for (let k of keys)
            table += `<td class="cell">${
                // if the attribute is a price, format it
                k.toUpperCase().indexOf("PRICE") > -1
                    ? sv.PRICE_FORMATTER.format(p[k])
                    : p[k]
            }</td>`;
        table += "</tr>";
    }

    table += "</table>";
    return table;
};

let searchTerm = "";

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write(`<title>${sv.STORE_TITLE} | List of Products</title>`);
    res.write(`<link rel="stylesheet" href="/css/style.css">`);

    // Get the product name to search for
    searchTerm = req.query.productName ? req.query.productName : "";

    /** $searchTerm now contains the search string the user entered
         Use it to build a query and print out the results. **/

    /** Create and validate connection **/
    getListOfProducts(searchTerm, res).then((v) => {
        /** Print out the ResultSet **/
        res.write(`<div class="container">`);
        // res.write(
        //     `<h3>Product list: ${JSON.stringify(req.session.productList)}</h3>`
        // );
        res.write(
            searchTerm.length > 0
                ? `<h1>Search results for "${searchTerm}":</h1>`
                : `<h1>Listing all products:</h1>`
        );

        res.write(
            `<form action="/listprod" class="form"><input type="text" class="textbox" name="productName" placeholder="Search for item"></input><input type="submit" class="button" value="Search"/></form>`
        );

        res.write(`<h2>${v.length} products found.</h2>`);
        let cols = ["ID", "Name", "Price", "Description", "Category"];
        if (v.length > 0) {
            res.write(createProductTable(v, cols));
        }

        res.write(`</div>`);
        res.end();
    });

    /** 
    For each product create a link of the form
    addcart?id=<productId>&name=<productName>&price=<productPrice>
    **/
});

export default router;
