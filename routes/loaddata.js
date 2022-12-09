import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import fs from "fs";
import * as sv from "../server.js";

export const router = express.Router();

const checkIfDatabaseExists = async () => {
    let result = false;
    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        let [rows] = await pool.query("SHOW TABLES;");

        result = rows.length > 0;
    } catch (err) {
        console.error(err);
    }
    return result;
};

const createDatabase = async () => {
    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        await pool.query("CREATE DATABASE IF NOT EXISTS ?;", [sv.dbPoolConfig.database]);
    } catch (err) {
        console.error(err);
    }
};

const loadSQLFile = async (filename) => {
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
                    results.push(`<p>${i}. <code>${c}</code></p>`);
                }
            }
        }
        pool.end();
    } catch (err) {
        console.error(`loaddata.js: ${err}`);
        // res.status(500).end();
    } finally {
        return results;
    }
};

router.use("/", async (req, res, next) => {
    let content = "";
    // res.setHeader("Content-Type", "text/html");
    // res.write(`<title>${sv.STORE_TITLE} | Load Database</title>`);

    let dbExists = await checkIfDatabaseExists();

    if (dbExists) {
        content += `<h2>Database already exists!</h2>`;
        content += `<p><span class="link"><a href="/cleardata">Click here to clear the database.</a></span></p>`;
    } else {
        content += `<h2>Loading Database...</h2>`;

        await createDatabase();

        let loadedData = await loadSQLFile("./data/data.sql");
        if (loadedData.length > 0) {
            content += `<h2>Database loaded successfully!</h2>`;
            content += `<p><span class="link"><a href="/stock">Click here to to stock warehouses.</a></span></p>`;
        } else {
            content += `<h2>Database load failed!</h2>`;
        }

        for (let r of loadedData) {
            content += r;
        }
    }

    res.render("template", {
        title: "Load Database",
        pageTitle: "Load Database",
        content,
    });
});

export default router;
// module.exports = router;
