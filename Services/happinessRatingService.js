const query = require("express");
const dbConnection = require("../db_connection/connection");


function getRatings()
{
    return new Promise((resolve, reject) => {
       
        const sql ='SELECT * FROM happiness_rating INNER JOIN games on games.game_id=happiness_rating.game_id';
        dbConnection.query(
          sql,
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
}

function insertRating(categoryData) {
  return new Promise((resolve, reject) => {
    const { rating_from, from_select, rating_to, to_select, rating_deducted, game_id  } = categoryData;
    const sql = `INSERT INTO happiness_rating (rating_from, from_select, rating_to, to_select, rating_deducted, game_id ) VALUES (${rating_from}, '${from_select}', ${rating_to}, '${to_select}', ${rating_deducted} , ${game_id})`;

    dbConnection.query(
      sql,
      [rating_from, from_select, rating_to, to_select, rating_deducted, game_id  ],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function updatedRating(ratingData)
{
  const {rating_id ,rating_from, from_select, rating_to, to_select, rating_deducted, game_id }=ratingData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE happiness_rating SET rating_from=${rating_from}, from_select='${from_select}', rating_to=${rating_to}, to_select='${to_select}', rating_deducted=${rating_deducted}, game_id=${game_id} WHERE rating_id='${rating_id}'`;
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

function deleteRating(rating_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`DELETE FROM happiness_rating  WHERE rating_id='${rating_id}'`

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
    let sql = 'SELECT * FROM happiness_rating INNER JOIN games on games.game_id=happiness_rating.game_id';

    // Check if search_query or game_id is provided and add WHERE clause accordingly
    if (search_query || game_id) {
      sql += ' WHERE ';
      const conditions = [];
  
      if (search_query) {
        conditions.push(`rating_deducted LIKE '%${search_query}%'`);
      }
  
      if (game_id) {
        conditions.push(`happiness_rating.game_id = ${game_id}`);
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

module.exports = { insertRating, getRatings, updatedRating, deleteRating, searchCategory };
