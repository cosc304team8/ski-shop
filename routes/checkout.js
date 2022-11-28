import express from "express";
import { checkAuthentication } from "../auth.js";

export const router = express.Router();

router.use("/", (req, res) => {
    let authenticated = checkAuthentication(req, res);

    if (authenticated) {
        res.redirect("/order");
    } else {
        let content = "";
        content += "<h1>Enter your user id to complete the transaction:</h1>";
        content += '<form method="get" action="order" accept-charset="UTF-8">';
        content += '<input class="textbox" type="text" name="customerId">';
        content +=
            '<input class="button" type="submit" value="Submit"><input class="button" type="reset" value="Reset">';
        content += "</form>";

        res.render("template", {
            title: "Checkout",
            content,
        });
    }
});

export default router;
// module.exports = router;
