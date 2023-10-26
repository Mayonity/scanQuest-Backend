const express = require("express");
const multer = require("multer");
const {
  getAllRecords,
  deleteRecord,
  searchRecord,
} = require("../controllers/productsController");
const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Specify the upload destination directory
const dbConnection = require("../db_connection/connection");
const fs = require("fs").promises; // Import fs.promises

const { insertProduct, updateProduct } = require("../models/productsService");

router.get("/get-all", getAllRecords);
router.post("/insert", upload.single("product_image"), async (req, res) => {
  try {
    const { product_name, product_rating, game_id, category_id } = req.body; // Get other form fields
    const { filename } = req.file; // Get the uploaded file name

    const productsData = {
      product_name,
      product_rating,
      game_id,
      category_id,
      filename,
    };

    // Call the controller function and pass the form data and filename

    const result = await insertProduct(productsData);

    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put(
  "/update/:product_id",
  upload.single("product_image"),
  async (req, res) => {
    try {
      const product_id = req.params.product_id; // Extract the entity ID from the URL params
      const { filename } = req.file; // The new file object

      const sql = `SELECT product_image from products WHERE product_id=${product_id}`;
      dbConnection.query(sql, async (err, result) => {
        if (result[0].product_image) {
          const existingFilePath = `uploads/${result[0].product_image}`;
          await fs.rm(existingFilePath); // Delete the existing file

          const { product_name, product_rating, game_id, category_id } =
            req.body;
          const productsData = {
            product_id,
            product_name,
            product_rating,
            game_id,
            category_id,
            filename,
          };

          await updateProduct(productsData);

          res.status(200).json({ message: "Record updated successfully!" });
        }
      });
    } catch (error) {
      console.error("Error updating file:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
router.delete("/delete/:product_id", deleteRecord);
router.post("/search", searchRecord);

module.exports = router;
