import express from "express";
import sql from "mysql2/promise";
// import fetch from "node-fetch";

import * as sv from "../server.js";

export const router = express.Router();

const getProductById = async (productId) => {
    let result = [];

    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query("SELECT * FROM product WHERE productId = ?;", [productId]);
        pool.end();
        result = rows;
    } catch (err) {
        console.error(err);
    }

    return result;
};

const getCategoryById = async (categoryId) => {
    let result = [];

    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query("SELECT categoryName FROM category WHERE categoryId = ?;", [categoryId]);
        pool.end();
        result = rows;
    } catch (err) {
        console.error(err);
    }

    return result;
};

const buildProductHTML = async (product, category, warehouseId) => {
    let html = "";

    html += `<div class="product">`;

    // Product header
    html += `<div class="product-header">`;
    html += `<h1>${product.productName}</h1>`;
    html += `<span class="desc">in <a href="/listProd?category=${category.categoryName}">${category.categoryName}</a></span>`;
    html += `</div>`;

    // Product image
    if (!product.productImage) {
        product.productImage = "";
    }
    html += `<div class="product-image">`;
    let imageSrc = `/displayImage?id=${product.productId}`;
    if (product.productImageURL) {
        imageSrc = product.productImageURL;
        html += `<img src="${imageSrc}" alt="Image of ${product.productName}"/>`;
    }
    if (product.productImage) {
        imageSrc = `/displayImage?id=${product.productId}`;
        html += `<img src="${imageSrc}" alt="Image of ${product.productName}"/>`;
    }

    html += `</div>`;

    // Product metadata
    html += `<div class="product-meta">`;
    html += `<h2>${sv.asPrice(product.productPrice)}</h2>`;
    html += `<span class="desc">${product.productDesc}</span>`;
    html += `</div>`;

    // Add to cart button
    html += `<form action="/addcart" method="GET">`;
    html += `<input type="hidden" name="id" value="${product.productId}"/>`;
    html += `<input type="hidden" name="name" value="${product.productName}"/>`;
    html += `<input type="hidden" name="price" value="${product.productPrice}"/>`;
    html += `<input class="button" type="submit" value="Add to Cart"/>`;
    html += await createSelectFromList(await productWarehouseQuantitiesList(product.productId, warehouseId));
    html += `</form>`;

    // Close product div
    html += `</div>`;

    return html;
};

const createProductPage = async (productId, warehouseId) => {
    let data = {};

    let product = await getProductById(productId);
    if (product.length === 0) {
        return `<h1>Product Not Found</h1>`;
    }

    let category = await getCategoryById(product[0].categoryId);
    if (category.length === 0) {
        category = [{ categoryName: "Unknown category" }];
    }
    data.html = await buildProductHTML(product[0], category[0], warehouseId);
    data.title = product[0].productName;

    return data;
};

const productWarehouseQuantitiesList = async (productId, warehouse = 1) => {
    let list = [];
    if (!warehouse) warehouse = 1;

    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let q = "SELECT quantity FROM productinventory WHERE productId = ? AND warehouseId = ? ORDER BY quantity ASC;";
        let [rows, fields] = await pool.query(q, [productId, warehouse]);
        if (rows.length > 0) {
            for (let i = 0; i < rows[0].quantity; i++) {
                list.push({ qty: i + 1, warehouse });
            }
        }
        pool.end();
    } catch (err) {
        throw new Error(`productQtyList: ${err}`);
    }
    return list;
};

const createSelectFromList = (list) => {
    let select = "";
    select += `<select class="dropdown" name="qty" required>`;
    for (let item of list) {
        select += `<option value="${item.qty}">${item.qty}</option>`;
    }
    select += `</select>`;
    if (list[0]) {
        select += `<span class="desc">in warehouse ${list[0].warehouse}</span>`;
    }
    return select;
};

router.use("/", (req, res) => {
    // Get the product ID from the request
    let productId = req.query.id;
    let warehouseId = req.query.warehouse;

    // Variables for the template
    let content = "";

    // Get the product from the database (async)
    createProductPage(productId, warehouseId).then((data) => {
        content += data.html;

        res.render("template", {
            title: data.title,
            content,
        });
    });
});
