const express = require("express");
const router = express.Router();
const sql = require("mysql");
const moment = require("moment");
const sv = require("../server");

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write(`<title>${req.app.get("storeName")} Grocery Order List</title>`);

    /** Create connection, and validate that it connected successfully **/
    const listOrder = async () => {
        res.write("<h1>Order List</h1>");
        res.write("<table border=1>");
        res.write(
            "<tr><th>Order ID</th><th>Customer ID</th><th>Order Date</th><th>Order Total</th></tr>"
        );
        try {
            let pool = await sql.createConnection(req.app.get("dbConfig"));
            pool.connect();

            let results = await pool.query(
                "select * from dbo.order",
                (error, results, fields) => {
                    if (error) {
                        throw error;
                    }
                    return results;
                }
            );

            let tableRows = "";
            for (let i = 0; i < results.length; i++) {
                tableRows += "<tr>";
                for (let j = 0; j < results[i].length; j++) {
                    tableRows += "<td>" + results[i][j] + "</td>";
                }
                // res.write(
                //     `<tr><td>${results[i].orderID}</td><td>${
                //         results[i].custID
                //     }</td><td>${moment(results[i].orderDate).format(
                //         "YYYY-MM-DD"
                //     )}</td><td>${results[i].orderTotal}</td></tr>`
                // );
                tableRows += "</tr>";
            }
            res.write(tableRows);
            pool.end();
        } catch (err) {
            console.dir(err);
        } finally {
            res.write("</table>");
            res.end();
        }
    };
    listOrder();
    /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

    /** Write query to retrieve all order headers **/

    /** For each order in the results
            Print out the order header information
            Write a query to retrieve the products in the order

            For each product in the order
                Write out product information 
    **/

    res.end();
});

module.exports = router;
