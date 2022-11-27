import express from "express";

export const router = express.Router();

router.get("/", function (req, res, next) {
    req.session.authenticatedUser = false;
    res.redirect("/");
});
