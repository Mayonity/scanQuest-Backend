const query = require("express");
const dbConnection = require("../db_connection/connection");


function getCategories()
{
    return new Promise((resolve, reject) => {
       
        const sql ='SELECT * FROM categories INNER JOIN games on games.game_id=categories.game_id';
        dbConnection.query(
          sql,
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
}

function insertCategory(categoryData) {
  return new Promise((resolve, reject) => {
    const { category_name, minimum_products, game_id } = categoryData;
    const sql = `INSERT INTO categories (category_name, minimum_products, game_id) VALUES ('${category_name}', ${minimum_products}, ${game_id})`;

    dbConnection.query(
      sql,
      [category_name, minimum_products, game_id ],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function updateCategory(categoryData)
{
  const {category_name,minimum_products,category_id}=categoryData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE categories SET category_name='${category_name}', minimum_products='${minimum_products}' WHERE category_id='${category_id}'`;
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

function searchCategory(search_query,game_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`SELECT * FROM categories INNER JOIN games on games.game_id=categories.game_id  WHERE category_name LIKE '%${search_query}%' OR categories.game_id=${game_id}`

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

module.exports = { insertCategory, getCategories, updateCategory, deleteCategory, searchCategory };
