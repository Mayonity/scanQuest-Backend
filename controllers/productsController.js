const { json } = require('express');
const {getProducts,deleteProduct,searchProducts}=require('../models/productsService')
const path = require('path');
const UPLOADS_FOLDER = 'uploads/';
async function getAllRecords(req, res) {
    try {
 
      const result = await getProducts()
  //    const imagePath = path.join(__dirname, UPLOADS_FOLDER, filename);
  result.forEach(element => {
    element.product_image = `${req.protocol}://${req.get('host')}/images/${element.product_image}`;
  });
      res.status(200).json({ message: 'Products fetched successfully', data: result });

      
    } catch (err) {
      console.error('Error fetching products:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }



  async function deleteRecord(req,res)
  {
    try
    {
      const product_id=req.params.product_id;
      const {product_image}=req.body

      const result=await deleteProduct(product_id,product_image);
      res.status(200).json({message:'Record deleted successfully'});
    } catch(err)
    {
      console.error('Error deleting product:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function searchRecord(req,res)
  {
    try
    {
      const {search_query, game_id, category_id}=req.body;
      const result=await searchProducts(search_query, game_id, category_id);
     
      result.forEach(element => {
        element.product_image = `${req.protocol}://${req.get('host')}/images/${element.product_image}`;
      });
      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
module.exports={getAllRecords,deleteRecord,searchRecord}