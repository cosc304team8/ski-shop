import express from "express";
import * as sv from "../server.js";

export const router = express.Router();

router.use("/", function (req, res, next) {
    let cartHtml = "";
    let productList = [];

    if (req.session.productList) {
        productList = req.session.productList;
        cartHtml += "<h2>Your Shopping Cart</h2>";
        cartHtml += `<table class="table">`;
        cartHtml += `<thead><tr><th class="hcell">Product Id</th><th class="hcell">Product Name</th><th class="hcell">Quantity</th>`;
        cartHtml += `<th class="hcell">Price</th><th class="hcell">Subtotal</th></tr></thead>`;

        cartHtml += "<tbody>";
        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (!product) {
                continue;
            }

            cartHtml += `<tr><td class="cell">${product.id}</td>`;
            cartHtml += `<td class="cell">${product.name}</td>`;

            cartHtml += `<td class="cell">${product.quantity}</td>`;

            cartHtml += `<td class="cell">${sv.PRICE_FORMATTER.format(product.price)}</td>`;
            cartHtml += `<td class="cell">${sv.PRICE_FORMATTER.format(product.price * product.quantity)}</td>`;
            cartHtml += "</tr>";
            total = total + product.quantity * product.price;
        }
        cartHtml += `<tr><td  class="cell" colspan="4" align="right"><b>Order Total:</b></td>`;
        cartHtml += `<td class="cell">${sv.PRICE_FORMATTER.format(total)}</td></tr>`;
        cartHtml += "</tbody>";
        cartHtml += "</table>";

        cartHtml += '<h3><span class="link"><a href="checkout">Check Out</a></span></h3>';
    } else {
        cartHtml += "<h2>Your shopping cart is empty!</h2>";
    }
    cartHtml += '<h3><span class="link"><a href="listprod">Continue Shopping</a></span></h3>';

    // res.render("showcart", {
    //     title: "Shopping Cart",
    // });

    cartHtml += `</div>`;

    res.render("showcart", {
        title: "Shopping Cart",
        pageTitle: `${sv.STORE_TITLE}`,
        cartContent: cartHtml,
    });

    return;
});

export default router;
