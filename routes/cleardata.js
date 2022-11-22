import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import fs from "fs";
import * as sv from "../server.js";

export const router = express.Router();

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
                    results.push(`<p>${i}. <code>${c}</code></p>`);
                }
            }
        }
        pool.end();
    } catch (err) {
        console.error(`Error in cleardata.js: ${err}`);
    } finally {
        return results;
    }
};

router.use("/", (req, res) => {
    clearFromSQLFile("./data/clear.sql", res).then((v) => {
        let content = "";
        if (v.length > 0) {
            content += `<h2>Data cleared successfully!</h2>`;
        } else {
            content += `<h2>No data to clear</h2>`;
        }

        for (let r of v) {
            content += r;
        }

        res.render("template", {
            title: "Clear Database",
            pageTitle: "Clear Database",
            content,
        });
    });
});
