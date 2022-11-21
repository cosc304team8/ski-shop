import express from "express";
import sql from "mysql2/promise";
import * as sv from "../server.js";

export const router = express.Router();

const getCategoryList = async (pool) => {
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
                k.toUpperCase().indexOf("PRICE") > -1 ? sv.PRICE_FORMATTER.format(p[k]) : p[k]
            }</td>`;
        table += "</tr>";
    }

    table += "</table>";
    return table;
};

router.use("/", function (req, res, next) {
    let productContent = "";

    // Get the product name to search for
    let searchTerm = req.query.productName ? req.query.productName : "";
    let categoryName = req.query.category ? req.query.category : "all";

    /** $searchTerm now contains the search string the user entered
         Use it to build a query and print out the results. **/

    /** Create and validate connection **/
    getListOfProducts(searchTerm, categoryName).then((v) => {
        /** Print out the ResultSet **/
        // res.write(
        //     `<h3>Product list: ${JSON.stringify(req.session.productList)}</h3>`
        // );
        let header = searchTerm.length > 0 ? `Search results for "${searchTerm}"` : `Listing all products`;
        productContent += `<h1>${header}${categoryName !== "all" ? ` in ${categoryName}` : ""}:</h1>`;

        let cats = `<option value="all" ${categoryName === "all" ? "selected" : ""}>All categories</option>`;
        for (let c of v.categories) {
            cats += `<option value="${c.categoryName}" ${categoryName === c.categoryName ? "selected" : ""}>${
                c.categoryName
            }</option>`;
        }

        productContent += `<form action="/listprod" class="form"><input type="text" class="textbox" name="productName" placeholder="Search for item" value="${searchTerm}"></input><select name="category" class="dropdown" onchange="this.form.submit();">${cats}</select><input type="submit" class="button" value="Search"/></form>`;

        productContent += `<h2>${v.products.length} products found.</h2>`;
        let cols = ["ID", "Name", "Price", "Description", "Category"];
        if (v.products.length > 0) {
            productContent += createProductTable(v.products, cols);
        }

        // res.end();
        res.render("listprod", {
            title: "List of Products",
            pageTitle: "List of Products",
            productContent,
        });
    });
    // end of promise
});

export default router;
