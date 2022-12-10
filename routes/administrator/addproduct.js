import express from "express";
import sql from "mysql2/promise";
import * as sv from "../../server.js";

export const router = express.Router();

router.post("/", async (req, res, next) => {
    res.setHeader("Content-Type", "text/html");

    res.write(JSON.stringify(req.body, null, 4).replace(/\n/g, "<br>"));

    let productName = req.body.productName;
    let productPrice = req.body.productPrice;
    let productDescription = req.body.productDesc;
    let productImage = req.files.productImage.file;
    let categoryId = req.body.categoryId;

    if (!productName || !productPrice) {
        res.write('Missing required fields: "productName" and "productPrice"');
        res.status(400).end();
        return;
    } else {
        if (!categoryId) {
            categoryId = 1;
        }

        try {
            let pool = await sql.createPool(sv.dbPoolConfig);
            let [rows, fields] = await pool.query(
                "INSERT INTO product (productName, productPrice, productDesc, productImage, categoryId) VALUES (?, ?, ?, BINARY(?), ?);",
                [productName, productPrice, productDescription, productImage, categoryId]
            );
            pool.end();
            res.write("Product added");
            res.status(200).end();
        } catch (err) {
            res.write(`Error adding product: ${err}`);
            res.status(500).end();
        }
    }
});
