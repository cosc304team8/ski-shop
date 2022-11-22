import express from "express";

export const router = express.Router();

router.use("/", (req, res) => {
    let content = "";
    content += "<h1>Enter your customer id to complete the transaction:</h1>";

    content += '<form method="get" action="order" accept-charset="UTF-8">';
    content += '<input class="textbox" type="text" name="customerId">';
    content += '<input class="button" type="submit" value="Submit"><input class="button" type="reset" value="Reset">';
    content += "</form>";

    res.render("template", {
        title: "Checkout",
        pageTitle: "Checkout",
        content,
    });
});

export default router;
// module.exports = router;
