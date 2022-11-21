import express from "express";
import * as sv from "../server.js";

export const router = express.Router();

router.get("/", function (req, res, next) {
    let productList = false;
    res.setHeader("Content-Type", "text/html");
    res.write(`<link rel="stylesheet" href="/css/style.css">`);
    res.write("<title>Shopping Cart</title>");
    res.write(`<div class="container">`);
    // res.write(
    //     `<h3>Product list: ${JSON.stringify(req.session.productList)}</h3>`
    // );
    if (req.session.productList) {
        productList = req.session.productList;
        res.write("<h1>Your Shopping Cart</h1>");
        res.write(`<table class="table">`);
        res.write(
            `<thead><tr><th class="hcell">Product Id</th><th class="hcell">Product Name</th><th class="hcell">Quantity</th>`
        );
        res.write(
            `<th class="hcell">Price</th><th class="hcell">Subtotal</th></tr></thead>`
        );

        res.write("<tbody>");
        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (!product) {
                continue;
            }

            res.write(`<tr><td class="cell">${product.id}</td>`);
            res.write(`<td class="cell">${product.name}</td>`);

            res.write(`<td class="cell">${product.quantity}</td>`);

            res.write(
                `<td class="cell">${sv.PRICE_FORMATTER.format(
                    product.price
                )}</td>`
            );
            res.write(
                `<td class="cell">${sv.PRICE_FORMATTER.format(
                    product.price * product.quantity
                )}</td>`
            );
            res.write("</tr>");
            total = total + product.quantity * product.price;
        }
        res.write(
            `<tr><td  class="cell" colspan="4" align="right"><b>Order Total</b></td>`
        );
        res.write(
            `<td class="cell">${sv.PRICE_FORMATTER.format(total)}</td></tr>`
        );
        res.write("</tbody>");
        res.write("</table>");

        res.write('<h2><a href="checkout">Check Out</a></h2>');
    } else {
        res.write("<h1>Your shopping cart is empty!</h1>");
    }
    res.write('<h2><a href="listprod">Continue Shopping</a></h2>');
    res.write("</div>");
    res.end();
});

export default router;
// module.exports = router;
