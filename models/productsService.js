const query = require("express");
const dbConnection = require("../db_connection/connection");
const fs = require('fs').promises; // Import fs.promises

function getProducts()
{
    return new Promise((resolve, reject) => {
       
        const sql ='SELECT * FROM products INNER JOIN games on games.game_id=products.game_id inner join categories on categories.category_id=products.category_id';
        dbConnection.query(
          sql,
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
}

function insertProduct(productsData) {
  return new Promise((resolve, reject) => {
    const {product_name, product_rating, game_id, category_id ,filename}=productsData
    const sql = `INSERT INTO products (product_image ,product_name, product_rating ,game_id, category_id) VALUES ('${filename}','${product_name}', '${product_rating}' , ${game_id}, ${category_id})`;

    dbConnection.query(
      sql,
      [product_name, product_rating, game_id, category_id ,filename],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function updateProduct(productsData)
{
  const {product_id,product_name, product_rating, game_id, category_id ,filename}=productsData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE products SET product_name='${product_name}', product_rating=${product_rating}, product_image='${filename}', game_id=${game_id}, category_id=${category_id}  WHERE product_id='${product_id}'`;
    dbConnection.query(
      sql,
      (err,result)=>
      {
        if(err) reject(err);
        resolve(result);
      }
    )
  })
}

async function deleteProduct(product_id,product_image)
{

    const sql=`DELETE FROM products WHERE product_id='${product_id}'`

    dbConnection.query(
      sql,
      async  (err,result)=>
      {
        if(err)return(err);
     
        const segments = product_image.split('/'); // Split the URL by '/'
        const lastSegment = segments[segments.length - 1]; // Get the last segment after the last '/'
        const existingFilePath = `uploads/${lastSegment}`;
        await fs.rm(existingFilePath); // Delete the existing file
      
      
        return(result);
      }
    )


}

function searchProducts(search_query, game_id, category_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`SELECT * FROM products INNER JOIN games on games.game_id=products.game_id inner join categories on categories.category_id=products.category_id  WHERE product_name LIKE '%${search_query}%' OR products.game_id=${game_id} OR products.category_id=${category_id}`

    dbConnection.query(
      sql,
      (err,result)=>
      {
        if(err)reject(err);
        resolve(result);
      }
    )

    
  })
}

module.exports = { insertProduct, getProducts, updateProduct, deleteProduct, searchProducts };
