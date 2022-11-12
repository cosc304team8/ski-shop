const express = require("express");
const router = express.Router();
const sql = require("mssql");
const moment = require("moment");
const sv = require("../server");

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write(`<title>${req.app.get("storeName")} Grocery Order List</title>`);

    /** Create connection, and validate that it connected successfully **/
    const listOrder = async () => {
        try {
            let pool = await sql.connect(req.app.get("dbConfig"));

            let result = await pool.request().query("select * from dbo.order");

            res.write("<h1>Order List</h1>");
            res.write("<table border=1>");
            res.write(
                "<tr><th>Order ID</th><th>Customer ID</th><th>Order Date</th><th>Order Total</th></tr>"
            );
            for (let i = 0; i < result.recordset.length; i++) {
                res.write(
                    `<tr><td>${result.recordset[i].orderID}</td><td>${
                        result.recordset[i].custID
                    }</td><td>${moment(result.recordset[i].orderDate).format(
                        "YYYY-MM-DD"
                    )}</td><td>${result.recordset[i].orderTotal}</td></tr>`
                );
            }
            res.write("</table>");
            res.end();
        } catch (err) {
            console.dir(err);
        } finally {
            sql.close();
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
