import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import fs from "fs";
import * as sv from "../server.js";

export const router = express.Router();

router.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.write(`<title>${sv.STORE_TITLE} | Clear Database</title>`);

    const clearFromSQLFile = async (filename, res) => {
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

            res.write("<h2>Database cleared!</h2>");
        } catch (err) {
            res.write("<h2>Database not cleared</h2>");
            console.error(`Error in cleardata.js: ${err}`);
        } finally {
            return results;
        }
    };

    clearFromSQLFile("./data/clear.sql", res).then((v) => {
        res.end();
    });
});
