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
                    results.push(`<p>${i}. <code>${c}</code></p>`);
                }
            }
        }
        pool.end();
    } catch (err) {
        console.error(`Error in loaddata.js: ${err}`);
        // res.status(500).end();
    } finally {
        return results;
    }
};

router.use("/", function (req, res, next) {
    let content = "";
    // res.setHeader("Content-Type", "text/html");
    // res.write(`<title>${sv.STORE_TITLE} | Load Database</title>`);

    content += `<h1>Loading Database...</h1>`;

    loadSQLFile("./data/data.sql", res).then((results) => {
        if (results.length > 0) {
            content += `<h2>Database loaded successfully!</h2>`;
        } else {
            content += `<h2>Database load failed!</h2>`;
        }

        for (let r of results) {
            content += r;
        }

        res.render("template", {
            title: "Load Database",
            pageTitle: "Load Database",
            content,
        });
    });
});

export default router;
// module.exports = router;
