import express from "express";

export const router = express.Router();

router.use("/", (req, res) => {
    let checkoutContent = "";
    checkoutContent += "<h1>Enter your customer id to complete the transaction:</h1>";

    checkoutContent += '<form method="get" action="order" accept-charset="UTF-8">';
    checkoutContent += '<input class="textbox" type="text" name="customerId">';
    checkoutContent +=
        '<input class="button" type="submit" value="Submit"><input class="button" type="reset" value="Reset">';
    checkoutContent += "</form>";

    res.render("checkout", {
        title: "Checkout",
        pageTitle: "Checkout",
        checkoutContent,
    });
});

export default router;
// module.exports = router;
