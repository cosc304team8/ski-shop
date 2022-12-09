import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import fs from "fs";
import { checkAuthentication } from "../auth.js";
import * as sv from "../server.js";

export const router = express.Router();

const clearFromSQLFile = async (filename) => {
    let results = [];
    try {
        let pool = await sql.createPool(sv.dbPoolConfig);
        await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
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
        console.error(`cleardata.js: ${err}`);
    } finally {
        return results;
    }
};

router.use("/", async (req, res) => {
    let authenticated = await checkAuthentication(req, res);

    let clearedData = await clearFromSQLFile("./data/clear.sql");
    let content = "";

    if (clearedData.length > 0) {
        content += `<h2>Data cleared successfully!</h2>`;
    } else {
        content += `<h2>No data to clear</h2>`;
    }

    for (let r of clearedData) {
        content += r;
    }

    res.render("template", {
        title: "Clear Database",
        pageTitle: "Clear Database",
        content,
    });
});
