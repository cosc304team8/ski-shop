import express from "express";

export const router = express.Router();

router.get("/", function (req, res, next) {
    let productList = false;
    res.setHeader("Content-Type", "text/html");
    res.write("<title>Your Shopping Cart</title>");
    if (req.session.productList) {
        productList = req.session.productList;
        res.write("<h1>Your Shopping Cart</h1>");
        res.write(
            `<table class="table"><tr><th class="hcell">Product Id</th><th class="hcell">Product Name</th><th class="hcell">Quantity</th>`
        );
        res.write(
            `<th class="hcell">Price</th><th class="hcell">Subtotal</th></tr>`
        );

        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (!product) {
                continue;
            }

            res.write(`<tr><td class="cell">product.id</td>`);
            res.write("<td>" + product.name + "</td>");

            res.write('<td class="cell">' + product.quantity + "</td>");

            res.write(
                '<td  class="cell">$' +
                    Number(product.price).toFixed(2) +
                    "</td>"
            );
            res.write(
                '<td class="cell">$' +
                    (
                        Number(product.quantity.toFixed(2)) *
                        Number(product.price)
                    ).toFixed(2) +
                    "</td></tr>"
            );
            res.write("</tr>");
            total = total + product.quantity * product.price;
        }
        res.write(
            '<tr><td  class="cell" colspan="4" align="right"><b>Order Total</b></td><td align="right">$' +
                total.toFixed(2) +
                "</td></tr>"
        );
        res.write("</table>");

        res.write('<h2><a href="checkout">Check Out</a></h2>');
    } else {
        res.write("<h1>Your shopping cart is empty!</h1>");
    }
    res.write('<h2><a href="listprod">Continue Shopping</a></h2>');

    res.end();
});

export default router;
// module.exports = router;
