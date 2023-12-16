const express = require("express");
const multer = require("multer");
const path = require('path');
const {
  getAllRecords,
  deleteRecord,
  searchRecord,
  getProduct
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

const { insertProduct, updateProduct, checkUniqueQrCode } = require("../Services/productsService");

router.get("/get-all", getAllRecords);

router.post("/insert", upload.single("image"), async (req, res) => {
  try {
    const {  qr_code,name, happiness_rating, game_id, category_id, cost, current_page } = req.body; // Get other form fields
    const { filename } = req.file; // Get the uploaded file name

    const productsData = {
      qr_code,
      name,
      happiness_rating,
      game_id,
      category_id,
      filename,
      cost,
    };

    // Call the controller function and pass the form data and filename

    const isUnique=await checkUniqueQrCode(qr_code);

    if(!isUnique)
    {
      res.status(400).json({error:'QR code already exists!'})
    }

    else
    {

      
      const result = await insertProduct(productsData,current_page);
      
      result.data.forEach(element => {
        element.image = `${req.protocol}://${req.get('host')}/uploads/${element.image}`;
      });
      res.status(200).json({ message: 'Product added successfully', data: result });
    }
        
      } catch (error) {
        console.error(error);
        res.status(500).json({error:"Error adding poduct. Please refresh the page and try again."});
      }
    });
    
    router.put(
  "/update/:product_id",
  upload.single("image"),
  async (req, res) => {
    try {
      const product_id = req.params.product_id; // Extract the entity ID from the URL params
      if(req.file)
      {
        
        const { filename } = req.file; // The new file object
        const { name,
          happiness_rating,
          game_id,
          category_id,
          cost,
          qr_code
        } =
        req.body;

      

          
          const result= await  getProductbyId(product_id)
          
     
        if (result[0].image) {
          const existingFilePath = `uploads/${result[0].image}`;
          await fs.rm(existingFilePath); // Delete the existing file
          
          
          const productsData = {
            product_id,
            name,
            happiness_rating,
            game_id,
            category_id,
            filename,
            cost,
            qr_code
          };
          
          
          await updateProduct(productsData);
          
          res.status(200).json({ message: "Record updated successfully!" , url: `${req.protocol}://${req.get('host')}/uploads/${filename}`});
        }
      }
      
      else
      {
      
        const { name,
          happiness_rating,
          game_id,
          category_id,
          cost,
          qr_code,
          image
        } =
        req.body;
        const filename=image.split('/uploads/')[1]
        const productsData = {
          product_id,
          name,
          happiness_rating,
          game_id,
          category_id,
          filename,
          cost,
          qr_code
        };
       

          
          await updateProduct(productsData);
          
          res.status(200).json({ message: "Record updated successfully!" , url: `${req.protocol}://${req.get('host')}/uploads/${filename}`});
        }
   
      }
         catch (error) {
      console.error("Error updating file:", error);
      res.status(500).json({error:"Error updating products. Please refresh the page and try again."});
    }
  }
);
router.delete("/delete/:product_id", deleteRecord);
router.post("/search", searchRecord);
router.get('/get-product',getProduct)


const getProductbyId=(id)=>
{
  
  return new Promise((resolve, reject) => {
 
  const sql = `SELECT image from products WHERE product_id=${id}`;
  dbConnection.query(sql, async (err, result) => {
    if(err)return reject(err);
    return resolve(result)
  })
  })
    }
module.exports = router;
