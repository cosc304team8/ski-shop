const express = require('express');
const mysql = require('mysql');
export const router = express.Router();

const recommendProducts = async (customerId) => {
    let result = [];
    try {
        let pool = sql.createPool(sv.dbPoolConfig);
        let [rows, fields] = await pool.query('SELECT * FROM reviews WHERE customerId = ? AND productId = ?', [customerId, productId]);
        pool.end();
        result = rows;
    } catch (err) {
        console.error(err);
    }

    return result;
};
router.use("/", (req, res) => {
    html="";
    if (recommendProducts()==0){
        
    }
app.post('/review', (req, res) => {
  // Insert the review in the database
  connection.query(
    'INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)',
    [req.session.userId, req.body.rating, req.body.comment],
    (error) => {
      if (error) {
        res.send(error.message);
      } else {
        // Show the thank you message
        res.send(`
          <h2>Thank you for your review!</h2>
          <p>Your rating: ${req.body.rating}</p>
          <p>Your comment: ${req.body.comment}</p>
        `);
      }
