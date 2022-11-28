import express from "express";
import sql from "mysql2/promise";
import fs from "fs";
import { checkAuthentication } from "../auth.js";
import * as sv from "../server.js";

export const router = express.Router();

export const imageFileToBinaryAsync = async (file) => {
    let bitmap = await fs.promises.readFile(file);
    return Buffer.from(bitmap);
};

export const imageFileToBinary = (file) => {
    const bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap);
};

const insertImage = async (conn, productId, image) => {
    try {
        let q = "INSERT INTO product (productId, productImage) VALUES (?, BINARY(?));";
        let [rows, fields] = await conn.execute(q, [productId, image]);
        return rows.affectedRows > 0;
    } catch (err) {
        throw new Error(`insertImage: ${err}`);
    }
    return false;
};

const updateImage = async (conn, productId, image) => {
    try {
        let q = "UPDATE product SET productImage = BINARY(?) WHERE productId = ?;";
        let [rows, fields] = await conn.execute(q, [image, productId]);
        return rows.affectedRows > 0;
    } catch (err) {
        throw new Error(`updateImage: ${err}`);
    }
    return false;
};

const verifyProductId = async (conn, productId) => {
    try {
        let q = "SELECT * FROM product WHERE productId = ?";
        let [rows, fields] = await conn.execute(q, [productId]);
        if (rows.length > 0) return true;
    } catch (err) {
        throw new Error(`verifyProductId: ${err}`);
    }
    return false;
};

const uploadImage = async (productId, image) => {
    let pool = sql.createPool(sv.dbPoolConfig);
    let conn = await pool.getConnection();
    let result = false;
    try {
        await conn.beginTransaction();
        let exists = await verifyProductId(conn, productId);
        if (exists) {
            result = await updateImage(conn, productId, image);
        }
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw new Error(`uploadImage: ${err}`);
    } finally {
        conn.release();
    }
    return result;
};

const productIdList = async () => {
    let list = [];
    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let q = "SELECT productId, productName FROM product ORDER BY productId ASC;";
        let [rows, fields] = await pool.query(q);
        for (let row of rows) {
            list.push({ id: row.productId, name: row.productName });
        }
        pool.end();
    } catch (err) {
        throw new Error(`productIdList: ${err}`);
    }
    return list;
};

const createSelectFromList = (list) => {
    let select = "";
    select += `<select class="dropdown" id="productId" name="productId" required>`;
    for (let item of list) {
        select += `<option value="${item.id}">${item.id}. ${item.name}</option>`;
    }
    select += `</select>`;
    return select;
};

const processFileUpload = async (req) => {
    let error = false;
    let success = false;
    try {
        let productId = getProductIdFromRequest(req);
        let productImage = getFileFromRequest(req);
        let image = await imageFileToBinaryAsync(productImage);

        success = await uploadImage(productId, image);
    } catch (err) {
        console.log(`processFileUpload: ${err}`);
        error = true;
    }
    return { success, error };
};

const getFileFromRequest = (req) => {
    let productImage = req.files.productImage.file;

    if (!productImage) {
        throw new Error("No file found in request");
    }

    return productImage;
};

const getProductIdFromRequest = (req) => {
    let productId = req.body.productId;

    if (!productId) {
        throw new Error("No product id found in request");
    }

    return productId;
};

router.post("/", (req, res) => {
    res.setHeader("Content-Type", "image/jpeg");
    console.log(`POST /uploadImage`);
    console.log(`req.body: ${JSON.stringify(req.body)}`);
    console.log(`req.files: ${JSON.stringify(req.files)}`);

    processFileUpload(req).then((result) => {
        if (result.success) {
            req.session.uploadSuccess = "Uploaded successfully";
            req.session.uploadError = false;
            res.redirect("/upload");
        } else {
            req.session.uploadError = "Upload failed";
            req.session.uploadSuccess = false;
            res.redirect("/upload");
        }
    });
});

router.use("/", (req, res) => {
    let authenticated = checkAuthentication(req, res);

    if (authenticated) {
        productIdList().then((list) => {
            let select = createSelectFromList(list);

            let success = req.session.uploadSuccess;
            req.session.uploadSuccess = false;

            let error = req.session.uploadError;
            req.session.uploadError = false;

            res.render("upload", {
                title: "Upload Product Image",
                pageTitle: "Upload Image",
                content: "Upload an image to the database",
                uploadSuccess: success,
                uploadError: error,
                productIdSelect: select,
            });
        });
    }
});
