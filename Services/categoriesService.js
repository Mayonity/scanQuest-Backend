const query = require("express");
const dbConnection = require("../db_connection/connection");


function getCategories(pageSize, pageNumber ) {

  return new Promise((resolve, reject) => {
    let sql = `
    SELECT categories.*, games.*, COUNT(products.product_id) AS total_products 
    FROM categories 
    INNER JOIN games ON games.game_id = categories.game_id 
    LEFT JOIN products ON categories.category_id = products.category_id AND products.is_deleted = 0
    GROUP BY categories.category_id 
    ORDER BY categories.category_id DESC 
    `;

    let countSql = `
      SELECT COUNT(*) AS totalRecords 
      FROM (
        SELECT categories.game_id
        FROM categories 
        INNER JOIN games ON games.game_id = categories.game_id 
    LEFT JOIN products ON categories.category_id = products.category_id AND products.is_deleted = 0
    GROUP BY categories.category_id 
    ORDER BY categories.category_id DESC   
      ) AS subquery
    `;

    if (pageSize && pageNumber && pageSize!==undefined) {
      const offset = (pageNumber - 1) * pageSize;
      sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
  

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
  }

  else
  {

    dbConnection.query(sql, (err, result) => {
      if (err) {
      reject(err);
    } else {
      resolve(result)
    }
  });
}
});
}

function getCategoriesByGame(game_id)
{
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT * from Categories
      WHERE game_id=${game_id}
    `;

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


function insertCategory(categoryData,current_page) {
  return new Promise((resolve, reject) => {
    const { category_name, minimum_products, game_id } = categoryData;
    const sql = `INSERT INTO categories (category_name, minimum_products, game_id) VALUES ('${category_name}', ${minimum_products}, ${game_id})`;

    dbConnection.query(
      sql,
      [category_name, minimum_products, game_id ],
     async (err, result) => {
        if (err) reject(err);
        const allCategories=await getCategories(10,current_page)
        resolve(allCategories);
      }
    );
  });
}

function updateCategory(categoryData)
{
  const {category_name,minimum_products,category_id,game_id}=categoryData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE categories SET category_name='${category_name}', minimum_products='${minimum_products}', game_id=${game_id} WHERE category_id='${category_id}'`;
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

function deleteCategory(category_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`DELETE FROM categories  WHERE category_id='${category_id}'`

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

function searchCategory(search_query, game_id, pageNumber) {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT categories.*, games.*, COUNT(products.product_id) AS total_products 
      FROM categories 
      INNER JOIN games ON games.game_id = categories.game_id 
      LEFT JOIN products ON categories.category_id = products.category_id 
    `;

    let countSql = `
      SELECT COUNT(*) AS totalRecords 
      FROM (
        SELECT categories.category_id
        FROM categories 
        INNER JOIN games ON games.game_id = categories.game_id 
        LEFT JOIN products ON categories.category_id = products.category_id 
    `;

    // Check if search_query or game_id is provided and add WHERE clause accordingly
    if (search_query || game_id) {
      sql += ' WHERE ';
      countSql += ' WHERE ';
      const conditions = [];

      if (search_query) {
        conditions.push(`category_name LIKE '%${search_query}%'`);
      }

      if (game_id) {
        conditions.push(`categories.game_id = ${game_id}`);
      }

      sql += conditions.join(' AND ');
      countSql += conditions.join(' AND ');
    }

    // Complete the SQL statements
    sql += ' GROUP BY categories.category_id';
    countSql += ' GROUP BY categories.category_id) AS subquery';

    if (pageNumber && pageNumber !== undefined) {

      const offset = (pageNumber - 1) * 10;
      sql += ` LIMIT ${10} OFFSET ${offset}`;
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
    }
  });
}

function getProductCategories(game_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`SELECT * FROM categories INNER JOIN games on games.game_id=categories.game_id 
    INNER JOIN products on products.category_id=categories.category_id 
    WHERE categories.game_id=${game_id} GROUP BY products.category_id`

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
module.exports = { insertCategory, getCategories, getCategoriesByGame,updateCategory, deleteCategory, searchCategory, getProductCategories };
