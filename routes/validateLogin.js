import express from "express";
import sql from "mysql2/promise";

import * as auth from "../auth.js";
import * as sv from "../server.js";

export const router = express.Router();

router.post("/", function (req, res) {
    // Have to preserve async context since we make an async call
    // to the database in the validateLogin function.
    // (async () => {
    //     let authenticatedUser = await validateLogin(req);
    //     if (authenticatedUser) {
    //         res.redirect("/");
    //     } else {
    //         res.redirect("/login");
    //     }
    // })();

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

        let q = "SELECT userid FROM customer WHERE userid = ? AND password = ?";
        let [rows, fields] = await pool.query(q, [username, password]);

        if (rows.length > 0) {
            authenticatedUser = rows[0].userid;
        }
    } catch (err) {
        console.log(err);
    }

    return authenticatedUser;
};
