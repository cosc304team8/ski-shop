import express from "express";
import sql from "mysql2/promise";
import * as sv from "../../server.js";
import { checkAuthentication } from "../../auth.js";

export const router = express.Router();

router.post("/", async (req, res, next) => {
    await checkAuthentication(req, res);

    console.log("delete product");
    console.log("req.body: ", JSON.stringify(req.body, null, 4));
    let productId = req.body.productId;

    if (productId) {
        try {
            let pool = await sql.createPool(sv.dbPoolConfig);
            let conn = await pool.getConnection();
            await conn.beginTransaction();

            let [rows, fields] = await conn.execute("DELETE FROM product WHERE productId = ?;", [productId]);

            await conn.commit();
            await conn.release();
            pool.end();
            res.redirect("/administrator#options");
        } catch (err) {
            console.error(err);
            res.write(`Error deleting product: ${err}`);
            res.status(500).end();
        }
    } else {
        res.redirect("/administrator#options");
    }
});
