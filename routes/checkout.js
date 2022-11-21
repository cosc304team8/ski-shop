import express from "express";

export const router = express.Router();

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.write("<title>Grocery CheckOut Line</title>");

    res.write(`<link rel="stylesheet" href="/css/style.css">`);

    res.write(`<div class="container">`);
    res.write("<h1>Enter your customer id to complete the transaction:</h1>");

    // res.write(
    //     `<h3>Product list: ${JSON.stringify(req.session.productList)}</h3>`
    // );

    res.write('<form method="get" action="order" accept-charset="UTF-8">');
    res.write('<input class="textbox" type="text" name="customerId">');
    res.write(
        '<input class="button" type="submit" value="Submit"><input class="button" type="reset" value="Reset">'
    );
    res.write("</form>");
    res.write("</div>");

    res.end();
});

export default router;
// module.exports = router;
