const express = require("express");
const router = express.Router();
const sql = require("mysql");
const fs = require("fs");

router.get("/", function (req, res, next) {
    (async function () {
        try {
            let pool = await sql.createConnection(req.app.get("dbConfig"));
            pool.connect();

            res.setHeader("Content-Type", "text/html");
            res.write(
                `<title>${req.app.get("storeName")} | Load Database</title>`
            );
            res.write("<h1>Connecting to database...</h1><div>");

            let data = fs.readFileSync("./data/data.sql", {
                encoding: "utf8",
            });
            let commands = data.split(";");
            for (let i = 0; i < commands.length; i++) {
                let command = commands[i];
                let result = await pool.query(
                    command,
                    (error, results, field) => {
                        // if (error) {
                        //     throw error;
                        // }
                        return results;
                    }
                );
                res.write(`<p>${i}. <code>${result.sql}</code></p>`);
            }
            pool.end();

            res.write("<h2>Database loading complete!</h2></div>");
        } catch (err) {
            console.warn(`Error in loaddata.js: ${err}`);
            res.write(err);
        } finally {
            res.end();
        }
    })();
});

module.exports = router;
