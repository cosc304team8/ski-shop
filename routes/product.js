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

const buildProductHTML = (product, category) => {
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
    html += `<h2>${sv.PRICE_FORMATTER.format(product.productPrice)}</h2>`;
    html += `<span class="desc">${product.productDesc}</span>`;
    html += `</div>`;

    // Add to cart button
    html += `<form action="/addcart" method="GET">`;
    html += `<input type="hidden" name="id" value="${product.productId}"/>`;
    html += `<input type="hidden" name="name" value="${product.productName}"/>`;
    html += `<input type="hidden" name="price" value="${product.productPrice}"/>`;
    html += `<input class="button" type="submit" value="Add to Cart"/>`;
    html += `</form>`;

    // Close product div
    html += `</div>`;

    return html;
};

const createProductPage = async (productId) => {
    let data = {};

    let product = await getProductById(productId);
    if (product.length === 0) {
        return `<h1>Product Not Found</h1>`;
    }

    let category = await getCategoryById(product[0].categoryId);
    if (category.length === 0) {
        category = [{ categoryName: "Unknown category" }];
    }
    data.html = buildProductHTML(product[0], category[0]);
    data.title = product[0].productName;

    return data;
};

router.use("/", (req, res) => {
    // Get the product ID from the request
    let productId = req.query.id;

    // Variables for the template
    let content = "";

    // Get the product from the database (async)
    createProductPage(productId).then((data) => {
        content += data.html;

        res.render("template", {
            title: data.title,
            pageTitle: "Product",
            content,
        });
    });
});
