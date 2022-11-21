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
    let loaddataContent = "";
    // res.setHeader("Content-Type", "text/html");
    // res.write(`<title>${sv.STORE_TITLE} | Load Database</title>`);

    loaddataContent += `<h1>Loading Database...</h1>`;

    loadSQLFile("./data/data.sql", res).then((v) => {
        if (v.length > 0) {
            loaddataContent += `<h2>Database loaded successfully!</h2>`;
        } else {
            loaddataContent += `<h2>Database load failed!</h2>`;
        }

        for (let r of v) {
            loaddataContent += r;
        }

        res.render("loaddata", {
            title: "Load Database",
            pageTitle: "Load Database",
            loaddataContent,
        });
    });
});

export default router;
// module.exports = router;
