import express from "express";
import sql from "mysql2/promise";
import * as sv from "../server.js";

export const router = express.Router();

export const getCategoryList = async (pool) => {
    try {
        let [rows, fields] = await pool.query("SELECT categoryName FROM category;");
        return rows;
    } catch (err) {
        console.error(`Error loading categories database: ${err}`);
    }
    return [];
};

const getListOfProducts = async (name, category = "%") => {
    if (category === "all") category = "%";

    let results = {};
    results.products = [];
    results.categories = [];

    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query(
            "SELECT productId, productName, productPrice, productDesc, (SELECT categoryName FROM category WHERE categoryId = product.categoryId) AS productCategory FROM product WHERE productName LIKE ? HAVING productCategory LIKE ?;",
            [`%${name}%`, category]
        );

        results.products = rows;

        results.categories = await getCategoryList(pool);

        pool.end();
    } catch (err) {
        console.error(`Error loading products database: ${err}`);
    } finally {
        return results;
    }
};

// Returns a string of HTML based on input table
const createProductTable = (products, cols) => {
    let keys = Object.keys(products[0]);
    let table = `<table class="table rounded">`;
    // Header row
    table += "<tr>";
    table += `<th class="hcell">+</th>`;
    for (let k of cols ? cols : keys) table += `<th class="hcell">${k}</th>`;
    table += "</tr>";

    // Data rows
    for (let p of products) {
        table += "<tr>";
        table += `<td class="cell"><span class="link"><a href="/addcart?id=${p.productId}&name=${p.productName}&price=${p.productPrice}">Add&nbsp;to&nbsp;cart</a></span></td>`;
        for (let k of keys) {
            let v = p[k];
            let idCellClass = "";
            // If the key is the ID, add a CSS class to center it
            if (k === "productId") {
                idCellClass = " t-center";
            } else if (k === "productName") {
                // If the key is the name, make it a link to the product page
                v = `<span class="link"><a href="/product?id=${p.productId}">${v}</a></span>`;
            }
            // If the key is a price, format it
            if (k.toUpperCase().indexOf("PRICE") > -1) {
                v = sv.asPrice(v);
            }

            table += `<td class="cell${idCellClass}">${v}</td>`;
        }
        table += "</tr>";
    }

    table += "</table>";
    return table;
};

router.use("/", function (req, res, next) {
    let content = "";

    // Get the product name to search for
    let searchTerm = req.query.productName ? req.query.productName : "";
    let categoryName = req.query.category ? req.query.category : "all";

    /** $searchTerm now contains the search string the user entered
         Use it to build a query and print out the results. **/

    /** Create and validate connection **/
    getListOfProducts(searchTerm, categoryName).then((results) => {
        /** Print out the ResultSet **/
        // res.write(
        //     `<h3>Product list: ${JSON.stringify(req.session.productList)}</h3>`
        // );
        let header = searchTerm.length > 0 ? `Search results for "${searchTerm}"` : `Listing all products`;

        content += `<h1>${header}${categoryName !== "all" ? ` in ${categoryName}` : ""}:</h1>`;

        let cats = `<option value="all" ${categoryName === "all" ? "selected" : ""}>All categories</option>`;
        for (let c of results.categories) {
            cats += `<option value="${c.categoryName}" ${categoryName === c.categoryName ? "selected" : ""}>${
                c.categoryName
            }</option>`;
        }

        content += `<form action="/listprod" class="form"><input type="text" class="textbox" name="productName" placeholder="Search for item" value="${searchTerm}"></input><select name="category" class="dropdown" onchange="this.form.submit();">${cats}</select><input type="submit" class="button" value="Search"/></form>`;

        content += `<h2>${results.products.length} products found.</h2>`;
        let cols = ["ID", "Name", "Price", "Description", "Category"];
        if (results.products.length > 0) {
            content += createProductTable(results.products, cols);
        }

        // res.end();
        res.render("template", {
            title: "List of Products",
            content,
        });
    });
    // end of promise
});

export default router;
