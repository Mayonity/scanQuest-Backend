const express = require("express");
const multer = require("multer");
const path = require('path');
const {
  getAllRecords,
  deleteRecord,
  searchRecord,
} = require("../controllers/productsController");
const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store files in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename by appending the current timestamp
    // and the file extension to the original filename
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const dbConnection = require("../db_connection/connection");
const fs = require("fs").promises; // Import fs.promises

const { insertProduct, updateProduct } = require("../Services/productsService");

router.get("/get-all", getAllRecords);
router.post("/insert", upload.single("image"), async (req, res) => {
  try {
    const { name, happiness_rating, game_id, category_id, cost } = req.body; // Get other form fields
    const { filename } = req.file; // Get the uploaded file name

    const productsData = {
      name,
      happiness_rating,
      game_id,
      category_id,
      filename,
      cost
    };

    // Call the controller function and pass the form data and filename

    const result = await insertProduct(productsData);
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`
    res.status(200).json({ message: "Product added successfully", imageUrl:imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put(
  "/update/:product_id",
  upload.single("image"),
  async (req, res) => {
    try {
      const product_id = req.params.product_id; // Extract the entity ID from the URL params
      const { filename } = req.file; // The new file object

      const sql = `SELECT product_image from products WHERE product_id=${product_id}`;
      dbConnection.query(sql, async (err, result) => {
        if (result[0].image) {
          const existingFilePath = `uploads/${result[0].image}`;
          await fs.rm(existingFilePath); // Delete the existing file

          const { name,
            happiness_rating,
            game_id,
            category_id,
            cost
             } =
            req.body;
          const productsData = {
            product_id,
            name,
            happiness_rating,
            game_id,
            category_id,
            filename,
            cost
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
