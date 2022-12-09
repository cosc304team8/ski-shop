import express from "express";
import moment from "moment";
import { checkAuthentication } from "../auth.js";
import sql from "mysql2/promise";

import * as sv from "../server.js";

export const router = express.Router();

const getDailySalesAmount = async () => {
    let results = [];
    try {
        let pool = sql.createPool(sv.dbPoolConfig);

        let q =
            "SELECT DATE(orderDate) AS orderDate, SUM(totalAmount) AS dailySalesAmount FROM ordersummary GROUP BY DATE(orderDate)";
        let [rows, fields] = await pool.query(q);
        results = rows;
        pool.end();
    } catch (err) {
        console.log(err);
    }
    return results;
};

export const dailyOrderTable = (results, cols) => {
    let table = `<table class="table rounded">`;
    for (let i = 0; i < results.length; i++) {
        let r = results[i];
        let keys = Object.keys(r);

        if (i === 0) {
            table += "<tr>";
            // Use cols if provided
            for (let k of cols ? cols : keys) {
                table += `<th class="hcell">${k}</th>`;
            }
            table += "</tr>";
        }

        table += "<tr>";
        for (let k of keys) {
            let value = r[k];
            if (k.toUpperCase().indexOf("AMOUNT") > -1 || k.indexOf("$") > -1) value = sv.asPrice(r[k]);

            if (k.toUpperCase().indexOf("DATE") > -1) value = moment(r[k]).format("YYYY-MM-DD");
            table += `<td class="cell">${value}</td>`;
        }

        table += "</tr>";
    }
    table += "</table>";
    return table;
};

router.use("/", function (req, res) {
    // TODO: Include files auth.jsp and jdbc.jsp

    let authenticated = checkAuthentication(req, res);

    if (authenticated) {
        res.setHeader("Content-Type", "text/html");

        getDailySalesAmount().then((results) => {
            let content = "";
            if (results.length > 0) {
                content += dailyOrderTable(results, ["Order Date", "Daily Sales Amount"]);
            } else {
                content = "No sales to summarize";
            }

            res.render("template", {
                title: "Daily Sales",
                pageTitle: "Daily Sales",
                content,
            });
        });
    } else {
        res.end();
    }
});
