const query = require("express");
const dbConnection = require("../db_connection/connection");


function getRatings(pageSize, pageNumber) {
  return new Promise((resolve, reject) => {
    const offset = (pageNumber - 1) * pageSize;
    const sql = `
      SELECT * FROM happiness_rating 
      INNER JOIN games ON games.game_id = happiness_rating.game_id
      ORDER BY happiness_rating.rating_id DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countSql = 'SELECT COUNT(*) AS totalRecords FROM happiness_rating INNER JOIN games ON games.game_id = happiness_rating.game_id';

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


function insertRating(categoryData,current_page) {
  return new Promise((resolve, reject) => {
    const { rating_from, from_select, rating_to, to_select, rating_deducted, game_id  } = categoryData;
    const sql = `INSERT INTO happiness_rating (rating_from, from_select, rating_to, to_select, rating_deducted, game_id ) VALUES (${rating_from}, '${from_select}', ${rating_to}, '${to_select}', ${rating_deducted} , ${game_id})`;

    dbConnection.query(
      sql,
      [rating_from, from_select, rating_to, to_select, rating_deducted, game_id  ],
     async (err, result) => {
        if (err) reject(err);
         const ratingData=await getRatings(10,current_page)
         resolve(ratingData)
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

function searchCategory(search_query,game_id,pageNumber)
{
  return new Promise((resolve,reject)=>
  {
    let sql = `
      SELECT * FROM happiness_rating 
      INNER JOIN games ON games.game_id = happiness_rating.game_id 
    `;

    let countSql = `SELECT COUNT(*) AS totalRecords FROM happiness_rating 
    INNER JOIN games ON games.game_id = happiness_rating.game_id`;

    const offset = (pageNumber - 1) * 10;
    // Check if search_query or game_id is provided and add WHERE clause accordingly
    if (search_query || game_id) {
      sql += ' WHERE ';
      countSql+=' WHERE '
      const conditions = [];
  
      if (search_query) {
        conditions.push(`rating_deducted LIKE '%${search_query}%'`);
      }
  
      if (game_id) {
        conditions.push(`happiness_rating.game_id = ${game_id}`);
      }
  
      sql += conditions.join(' AND ');
      countSql+=conditions.join(' AND ')
      
    }
    sql+=`  LIMIT ${10} OFFSET ${offset} `
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


function getGameRules(game_id) {
  return new Promise((resolve, reject) => {
   
    const sql = `
      SELECT * FROM happiness_rating WHERE game_id=${game_id}
    `;

   
    dbConnection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = { insertRating, getRatings, updatedRating, deleteRating, searchCategory, getGameRules };
