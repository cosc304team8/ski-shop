import express from "express";
import sql from "mysql2/promise";

import * as auth from "../auth.js";
import * as sv from "../server.js";

export const router = express.Router();

router.post("/", function (req, res) {
    validateLogin(req).then((authenticatedUser) => {
        if (authenticatedUser) {
            // console.log(`authenticatedUser: ${authenticatedUser}`);
            req.session.authenticatedUser = authenticatedUser;

            let redirectUrl = req.session.redirectUrl;
            if (redirectUrl) {
                delete req.session.redirectUrl;
                res.redirect(redirectUrl);
            } else {
                res.redirect("/");
            }
        } else {
            req.session.loginMessage = "Invalid username or password";
            res.redirect("/login");
        }
    });
});

const validateLogin = async (req) => {
    if (!req.body || !req.body.username || !req.body.password) {
        console.log(`Error with request: ${JSON.stringify(req.body)}`);
        return false;
    }

    let username = req.body.username;
    let password = req.body.password;
    let authenticatedUser = false;

    try {
        let pool = sql.createPool(sv.dbPoolConfig);

        let q = "SELECT customerId, firstName, lastName, userid FROM customer WHERE userid = ? AND password = ?";
        let [rows, fields] = await pool.query(q, [username, password]);

        if (rows.length > 0) {
            authenticatedUser = { ...rows[0] };
        }
    } catch (err) {
        console.log(err);
    }

    return authenticatedUser;
};
