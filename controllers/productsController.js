const { json } = require('express');
const {getProducts,deleteProduct,searchProducts}=require('../Services/productsService')
const path = require('path');
const dbConnection = require('../db_connection/connection');
const UPLOADS_FOLDER = 'uploads/';
async function getAllRecords(req, res) {
    try {
 
      const result = await getProducts()
  //    const imagePath = path.join(__dirname, UPLOADS_FOLDER, filename);
  result.forEach(element => {
    element.image = `${req.protocol}://${req.get('host')}/uploads/${element.image}`;
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
      let image
      const product_id=req.params.product_id;

      const sql = `SELECT image FROM products WHERE product_id=${product_id} `;
      dbConnection.query(
        sql,
        async  (err,result)=>
        {
          if(err)return(err);
          console.log(result)
          image=result[0].image
          console.log(image)
          const rest=await deleteProduct(product_id,image);
          res.status(200).json({message:'Record deleted successfully'});
        }
      )
     

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
        element.image = `${req.protocol}://${req.get('host')}/uploads/${element.image}`;
      });
      res.status(200).json({message:'Search done successfully', data:result});
      


    }  catch(err)
    {
      console.error('Error searching game:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
module.exports={getAllRecords,deleteRecord,searchRecord}