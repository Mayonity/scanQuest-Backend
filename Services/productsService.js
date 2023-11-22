const query = require("express");
const dbConnection = require("../db_connection/connection");
const fs = require('fs').promises; // Import fs.promises

function getProducts(pageSize, pageNumber)
{
    return new Promise((resolve, reject) => {
      const offset = (pageNumber - 1) * pageSize;
        const sql =`SELECT * FROM products INNER JOIN games on games.game_id=products.game_id inner join
         categories on categories.category_id=products.category_id 
         LIMIT ${pageSize} OFFSET ${offset}`;
         
         const countSql='SELECT COUNT(*) AS totalRecords FROM products INNER JOIN games on games.game_id=products.game_id inner join categories on categories.category_id=products.category_id'

       dbConnection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        // Execute count SQL query to get total record count
        dbConnection.query(countSql, (countErr, countResult) => {
          if (countErr) {
            reject(countErr);
          } else {
            const totalRecords = countResult.length > 0 ? countResult[0].totalRecords : 0;
            resolve({ data: result, total_records: totalRecords });
          }
        });
      }
    });
      });
}

function insertProduct(productsData,pageNumber) {
  return new Promise((resolve, reject) => {
    const { 
      qr_code,
      name,
      happiness_rating,
      game_id,
      category_id,
      filename,
    cost}=productsData
    const sql = `INSERT INTO products (qr_code,image ,name, happiness_rating ,game_id, category_id,cost) VALUES ('${ qr_code}','${filename}','${name}', '${happiness_rating}' , ${game_id}, ${category_id}, ${cost})`;

    dbConnection.query(
      sql,
      [qr_code,name, happiness_rating, game_id, category_id ,filename,cost],
     async (err, result) => {
        if (err) reject(err);
        const allProducts=await getProducts(3,pageNumber)
        resolve(allProducts);
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
    filename,cost,
    qr_code}=productsData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE products SET qr_code='${qr_code}', name='${name}', happiness_rating=${happiness_rating}, image='${filename}', game_id=${game_id}, category_id=${category_id}, cost=${cost}  WHERE product_id='${product_id}'`;
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

function searchProducts(search_query, game_id, category_id,pageNumber)
{
  return new Promise((resolve,reject)=>
  {
    let sql = `SELECT * FROM products 
    INNER JOIN games ON games.game_id = products.game_id 
    INNER JOIN categories ON categories.category_id = products.category_id`;

    let countSql = `SELECT COUNT(*) AS totalRecords FROM products
     INNER JOIN games ON games.game_id = products.game_id 
     INNER JOIN categories ON categories.category_id = products.category_id `;

     const offset = (pageNumber - 1) * 10;
    // Check if search_query, game_id, or category_id is provided and add WHERE clause accordingly
    if (search_query || game_id || category_id) {
      sql += ' WHERE ';
      countSql+=' WHERE '
      const conditions = [];
  
      if (search_query) {
        conditions.push(`name LIKE '%${search_query}%' `);
      }
  
      if (game_id) {
        conditions.push(`products.game_id = ${game_id} `);
      }
  
      if (category_id) {
        conditions.push(`products.category_id = ${category_id}`);
      }
  
      sql += conditions.join(' AND ');
      countSql+=conditions.join(' AND ')
    }

    sql+=` LIMIT ${10} OFFSET ${offset} `
  
    dbConnection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        // Execute count SQL query to get total record count
        dbConnection.query(countSql, (countErr, countResult) => {
          if (countErr) {
            reject(countErr);
          } else {
            const totalRecords = countResult.length > 0 ? countResult[0].totalRecords : 0;
            resolve({ data: result, total_records: totalRecords });
          }
        });
      }
    });
    
  })
}
function getCartProduct( product_id,game_id)
{
  return new Promise((resolve, reject) => {
 
    const sql = `SELECT * FROM products 
    WHERE qr_code = '${product_id}' AND game_id=${game_id}`;

    console.log(product_id,game_id)
     
     dbConnection.query(sql, (err, result) => {
    if (err) {
      reject(err);
    } else {
      // Execute count SQL query to get total record count
     resolve(result)
    }
  });
    });
}

module.exports = { insertProduct, getProducts, updateProduct, deleteProduct, searchProducts, getCartProduct };
