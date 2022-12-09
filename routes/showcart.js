import express from "express";
import * as sv from "../server.js";

export const router = express.Router();

router.use("/", function (req, res, next) {
    let content = "";
    let productList = [];

    if (req.session.productList) {
        productList = req.session.productList;
        content += "<h2>Your Shopping Cart</h2>";
        content += `<table class="table rounded">`;
        content += `<thead><tr><th class="hcell">Product Id</th><th class="hcell">Product Name</th><th class="hcell">Quantity</th>`;
        content += `<th class="hcell">Price</th><th class="hcell">Subtotal</th></tr></thead>`;

        content += "<tbody>";
        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (!product) {
                continue;
            }

            content += `<tr><td class="cell">${product.id}</td>`;
            content += `<td class="cell">${product.name}</td>`;

            content += `<td class="cell"><input form="updateCartForm" type="hidden" name="id" value="${product.id}"/><input form="updateCartForm" class="textbox" name="quantity" style="width: 4em; font-size: 12pt;" type="number" value="${product.quantity}" min="0" oninput="((target) => {target.value !== '${product.quantity}' ? target.classList.add('updated') : target.classList.remove('updated');})(this)"/></td>`;

            content += `<td class="cell price">${sv.asPrice(product.price)}</td>`;
            content += `<td class="cell price">${sv.asPrice(product.price * product.quantity)}</td>`;
            content += "</tr>";
            total = total + product.quantity * product.price;
        }
        content += `<tr>`;
        // content += `<td class="cell t-right" colspan="3"></td>`;
        content += `<td  class="cell" colspan="4" align="right"><b>Order Total:</b></td>`;
        content += `<td class="cell price">${sv.asPrice(total)}</td></tr>`;
        content += "</tbody>";
        content += "</table>";

        content += '<h3><span class="link"><a href="checkout">Check Out</a></span></h3>';
    } else {
        content += "<h2>Your shopping cart is empty!</h2>";
    }
    content += '<h3><span class="link"><a href="listprod">Continue Shopping</a></span></h3>';

    content += `</div>`;

    res.render("template", {
        title: "Shopping Cart",
        content,
    });

    return;
});

export default router;
