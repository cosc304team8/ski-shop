import express from "express";
import sql from "mysql2/promise";
import moment from "moment";
import * as sv from "../../server.js";
import { checkAuthentication } from "../../auth.js";

export const router = express.Router();

// generate sales report html
const getSalesData = async () => {
    let result = [];

    try {
        let pool = await sql.createPool(sv.dbPoolConfig);

        let [rows] = await pool.query(
            "SELECT orderDate, COUNT(orderId) AS numOrders, SUM(totalAmount) AS totalRevenue FROM ordersummary GROUP BY orderDate"
        );

        result = rows;
    } catch (err) {
        console.error(err);
    }

    return result;
};

const generateSalesReport = (sales) => {
    let table = `<table class="table" style="width: 100%;">`;
    table += `<thead>`;
    table += `<tr>`;
    table += `<th class="hcell">Date</th>`;
    table += `<th class="hcell">Number of Orders</th>`;
    table += `<th class="hcell">Total Revenue</th>`;
    table += `</tr>`;
    table += `</thead>`;

    table += `<tbody>`;
    for (let s of sales) {
        table += `<tr>`;
        table += `<td class="cell">${moment(s.orderDate).format("YYYY/MM/DD [at] HH:mm:ss")}</td>`;
        table += `<td class="cell">${s.numOrders}</td>`;
        table += `<td class="cell">${sv.asPrice(s.totalRevenue)}</td>`;
        table += `</tr>`;
    }
    table += `</tbody>`;

    table += `</table>`;
    return table;
};

const generateTableForOneOrder = (order) => {};

// generate customer info table
const getCustomerData = async () => {
    let result = [];

    try {
        let pool = await sql.createPool(sv.dbPoolConfig);

        let [rows] = await pool.query("SELECT * FROM customer");

        result = rows;
    } catch (err) {
        console.error(err);
    }

    return result;
};

const generateCustomerTable = async (customers) => {
    let table = `<table class="table">`;
    table += `<tr>`;

    table += `<th class="hcell">ID</th>`;
    table += `<th class="hcell">Name</th>`;
    table += `<th class="hcell">Address</th>`;
    table += `<th class="hcell">Phone</th>`;
    table += `<th class="hcell">Email</th>`;
    table += `<th class="hcell">User ID</th>`;

    table += `</tr>`;
    for (let i = 0; i < customers.length; i++) {
        table += `<tr>`;

        table += `<td class="cell" style="text-align: center;">${customers[i].customerId}</td>`;
        table += `<td class="cell">${buildNameString(customers[i].firstName, customers[i].lastName)}</td>`;
        table += `<td class="cell">${buildAddressString(
            customers[i].address,
            customers[i].city,
            customers[i].state,
            customers[i].postalCode,
            customers[i].country
        )}</td>`;
        table += `<td class="cell">${customers[i].phonenum}</td>`;
        table += `<td class="cell">${customers[i].email}</td>`;
        table += `<td class="cell"><code>${customers[i].userid}</code></td>`;
    }
    table += `</table>`;
    return table;
};

const buildNameString = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
};

const buildAddressString = (street, city, state, postalCode, country) => {
    // make sure postal code isn't split up using &nbsp;
    postalCode = postalCode.replace(" ", "\u00A0");

    let addr = `${street}<br />`;
    addr += `${city}, ${state} ${postalCode}<br />`;
    addr += `${country}`;

    return addr;
};

router.get("/", async (req, res) => {
    let authenticated = checkAuthentication(req, res);

    if (authenticated) {
        // sales reports
        let sales = await getSalesData();
        let salesReport = await generateSalesReport(sales);

        // get customer data
        let customers = await getCustomerData();
        let customerTable = await generateCustomerTable(customers);

        res.render("administrator", {
            title: "Administrator Portal",
            content: "<p>This is the administrator portal</p>",
            salesReport,
            customerTable,
        });
    }
});
