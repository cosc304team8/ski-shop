import express from "express";
import sql from "mysql2/promise";

import * as sv from "../server.js";

export const router = express.Router();

const getImageById = async (id) => {
    let image = "";
    try {
        let pool = sql.createPool(sv.dbPoolConfig);

        let q = "SELECT productImage FROM product WHERE productId = ?";
        let [rows, fields] = await pool.query(q, [id]);

        if (rows.length > 0) {
            image = rows[0].productImage;
        } else {
            throw new Error(`No image found with id ${id}`);
        }
    } catch (err) {
        console.log(`Error in getImageById: ${err.message}`);
    }
    return image;
};

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "image/jpeg");

    let id = req.query.id;
    let idVal = parseInt(id);
    if (isNaN(idVal)) {
        res.end();
        return;
    }

    getImageById(idVal).then((image) => {
        if (image) {
            res.write(image);
        }
        res.end();
    });
});
