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
    const { name,
      happiness_rating,
      game_id,
      category_id,
      filename,
    cost}=productsData
    const sql = `INSERT INTO products (image ,name, happiness_rating ,game_id, category_id,cost) VALUES ('${filename}','${name}', '${happiness_rating}' , ${game_id}, ${category_id}, ${cost})`;

    dbConnection.query(
      sql,
      [name, happiness_rating, game_id, category_id ,filename,cost],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function updateProduct(productsData)
{
  const {product_id, name,
    happiness_rating,
    game_id,
    category_id,
    filename,cost}=productsData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE products SET name='${name}', happiness_rating=${happiness_rating}, image='${filename}', game_id=${game_id}, category_id=${category_id}, cost=${cost}  WHERE product_id='${product_id}'`;
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
    let sql = 'SELECT * FROM products INNER JOIN games ON games.game_id = products.game_id INNER JOIN categories ON categories.category_id = products.category_id';

    // Check if search_query, game_id, or category_id is provided and add WHERE clause accordingly
    if (search_query || game_id || category_id) {
      sql += ' WHERE ';
      const conditions = [];
  
      if (search_query) {
        conditions.push(`name LIKE '%${search_query}%'`);
      }
  
      if (game_id) {
        conditions.push(`products.game_id = ${game_id}`);
      }
  
      if (category_id) {
        conditions.push(`products.category_id = ${category_id}`);
      }
  
      sql += conditions.join(' AND ');
    }
  
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
