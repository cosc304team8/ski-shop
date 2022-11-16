import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import fs from "fs";
import * as sv from "../server.js";

export const router = express.Router();

const loadSQLFile = async (filename, res) => {
    let results = [];
    try {
        let pool = await sql.createPool(sv.dbPoolConfig);

        let data = fs.readFileSync(filename, { encoding: "utf8" });
        let commands = data.split(";");
        let c;
        for (let i = 0; i < commands.length; i++) {
            c = commands[i]
                .split("--")[0]
                .trim()
                .replace(/\r?\n|\r/g, " ");
            if (c.length > 0) {
                let result = await pool.query(c);

                if (result) {
                    res.write(`<p>${i}. <code>${c}</code></p>`);
                    results.push(c);
                }
            }
        }
        pool.end();
    } catch (err) {
        console.error(`Error in loaddata.js: ${err}`);
        // res.status(500).end();
        return "Error loading database.";
    } finally {
        return "Database loading complete!";
    }
};

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write(`<title>${sv.STORE_TITLE} | Load Database</title>`);

    res.write(`<h1>Loading Database...</h1>`);

    loadSQLFile("./data/data.sql", res).then((v) => {
        res.write(`<h2>${v}</h2></div>`);
        res.end();
    });
});

export default router;
// module.exports = router;
