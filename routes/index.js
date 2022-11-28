import express from "express";
import * as sv from "../server.js";

export const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        title: "Home",
        pageTitle: "Kelowna Alpine",
        storeName: sv.STORE_TITLE,
        authenticatedUser: req.session.authenticatedUser,
    });
});
