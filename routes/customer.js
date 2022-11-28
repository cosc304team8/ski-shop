import express from "express";
import sql from "mysql2/promise";
import * as sv from "../server.js";
import { checkAuthentication } from "../auth.js";

export const router = express.Router();

const getCustomerById = async (userid, attr = []) => {
    let customer = [];
    try {
        let pool = sql.createPool(sv.dbPoolConfig);

        let q = `SELECT ${attr.length > 0 ? attr.join(", ") : "*"} FROM customer WHERE userid = ?;`;
        let [rows, fields] = await pool.query(q, [userid]);

        if (rows.length > 0) customer = rows[0];
        pool.end();
    } catch (err) {
        console.log(`getCustomerById: ${err}`);
    }

    return customer;
};

const buildCustomerInfoTable = (customer, cols = []) => {
    let table = `<table class="table">`;
    let keys = Object.keys(customer);
    for (let i = 0; i < keys.length; i++) {
        let kh = keys[i];
        if (cols.length > 0) kh = cols[i];
        table += `<tr><th class="hcell t-right">${kh}</th><td class="cell">${customer[keys[i]]}</td></tr>`;
    }
    table += "</table>";
    return table;
};

router.get("/", function (req, res, next) {
    let authenticated = checkAuthentication(req, res);

    if (authenticated) {
        let userid = req.session.authenticatedUser;

        let attr = [
            "customerId",
            "firstName",
            "lastName",
            "email",
            "phoneNum",
            "address",
            "city",
            "state",
            "postalCode",
            "country",
            "userid",
        ];

        getCustomerById(userid, attr).then((customer) => {
            let cols = [
                "ID",
                "First Name",
                "Last Name",
                "Email",
                "Phone",
                "Address",
                "City",
                "State",
                "Postal Code",
                "Country",
                "User ID",
            ];
            let content = buildCustomerInfoTable(customer, cols);
            res.render("template", { title: "Customer", pageTitle: "Profile Info", content: content });
            // res.render("customer", { customer: customer });
        });
    } else {
        res.end();
    }
});
