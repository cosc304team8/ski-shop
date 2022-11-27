import express from "express";

export const router = express.Router();

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    // Set the message for the login, if present
    let loginMessage = false;
    if (req.session.loginMessage) {
        loginMessage = req.session.loginMessage;
        req.session.loginMessage = false;
    }

    res.render("login", {
        title: "Login Screen",
        loginMessage: loginMessage,
    });
});
