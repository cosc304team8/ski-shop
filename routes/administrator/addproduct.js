import express from "express";
import sql from "mysql2/promise";
import * as sv from "../../server.js";
import { imageFileToBinaryAsync } from "../upload.js";
import { checkAuthentication } from "../../auth.js";

export const router = express.Router();

router.post("/", async (req, res, next) => {
    await checkAuthentication(req, res);

    let productName = req.body.productName;
    let productPrice = req.body.productPrice;
    let productDescription = req.body.productDesc;
    let productImage = req.files.productImage.file;
    let categoryId = req.body.category;

    if (!productName || !productPrice) {
        res.write('Missing required fields: "productName" and "productPrice"');
        res.status(400).end();
        return;
    } else {
        if (!categoryId) {
            categoryId = 1;
        }

        productImage = await imageFileToBinaryAsync(productImage);

        try {
            let pool = await sql.createPool(sv.dbPoolConfig);
            let conn = await pool.getConnection();
            await conn.beginTransaction();

            let [rows, fields] = await conn.execute(
                "INSERT INTO product (productName, productPrice, productDesc, productImage, categoryId) VALUES (?, ?, ?, BINARY(?), ?);",
                [productName, productPrice, productDescription, productImage, categoryId]
            );

            [rows, fields] = await conn.execute(
                "SELECT productId, price FROM product ORDER BT productId DESC LIMIT 1;"
            );

            let productId = rows[0].productId;

            [rows, fields] = await conn.execute(
                "INSERT INTO productinventory (productId, warehouseId, quantity, price) VALUES (?, 1, 10, ?);",
                [productId, productPrice]
            );

            await conn.commit();
            await conn.release();
            pool.end();
        } catch (err) {
            res.write(`Error adding product: ${err}`);
            res.status(500).end();
        }
        res.redirect("/administrator");
    }
});
