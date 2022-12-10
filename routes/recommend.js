import express from "express";
import sql from "mysql2/promise";
import * as sv from "../server.js";

export const router = express.Router();

const recommendProducts = async (customerId) => {
    let result = [];
    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query("SELECT p.* FROM product p INNER JOIN orderSummary o ON p.productId = o.productId WHERE o.customerId = ? GROUP BY p.productId ORDER BY COUNT(*) DESC LIMIT 10", [customerId]);
        pool.end();
        result = rows;
    } catch (err) {
        console.error(err);
    }

    return result;
};


router.use("/", (req, res) => {
    recommendProducts(req.session.customerId)
      .then((products) => {
        const html = `
          <h2>Product Recommendations</h2>
          <ul>
            ${products
              .map(
                (product) =>
                  `<li>
                    <h3>${product.productName}</h3>
                    <img src="${product.productImageURL}" alt="${product.productName}" />
                    <p>${product.productPrice}</p>
                    <span class="link"><a href="/addcart?id=${p.productId}&name=${p.productName}&price=${p.productPrice}">Add to cart</a></span>
                  </li>`
              )
              .join('')}
          </ul>
        `;
      })
        
    // Variables for the template
        let content = "";
        content+=html;
        res.render("template", {
            title: "Recommendations",
            content,
        });
    });

export default router;
