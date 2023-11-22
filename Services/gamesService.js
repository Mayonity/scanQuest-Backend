const query = require("express");
const dbConnection = require("../db_connection/connection");
const { insertField } = require("./fieldService");

function getGames(pageSize, pageNumber) {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT games.*, COUNT(categories.category_id) AS total_categories, COUNT(products.product_id) AS total_products  
      FROM games 
      LEFT JOIN categories ON categories.game_id = games.game_id 
      LEFT JOIN products ON products.game_id = games.game_id 
      GROUP BY games.game_id
    `;

    let countSql = `
      SELECT COUNT(*) AS totalRecords 
      FROM (
        SELECT games.game_id
        FROM games 
        LEFT JOIN categories ON categories.game_id = games.game_id 
        LEFT JOIN products ON products.game_id = games.game_id 
        GROUP BY games.game_id
      ) AS subquery
    `;

    if (pageSize && pageNumber && pageSize != undefined) {
      
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


function insertGame(gameData,current_page) {
  return new Promise((resolve, reject) => {
    const { game_name, game_objectives } = gameData;

    const sql = `INSERT INTO games (game_name, game_objectives) VALUES ('${game_name}', '${game_objectives}')`;

    dbConnection.query(
      sql,
      [game_name, game_objectives],
     async  (err, result) => {
        if (err) reject(err);
        const fieldData=[
          {
            label:'Class',
            value:'', 
            type:'Text Field',
            status:false,
            game_id:result.insertId
          },
          {
            label:'Name',
            value:'', 
            type:'Text Field',
            status:false,
            game_id:result.insertId
          },
          {
            label:'Total Guests',
            value:'', 
            type:'Text Field',
            status:false,
            game_id:result.insertId
          },
          {
            label:'Available Funds',
            value:'', 
            type:'Text Field',
            status:false,
            game_id:result.insertId
          }
        ]
        fieldData.forEach((element)=>
        {
          insertField(element)
        })
     
       const games= await getGames(10,current_page)
       resolve(games)
      }
    );
  });
}
function updateGame(gameData)
{
  const {game_id,game_name,game_objectives}=gameData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE games SET game_name='${game_name}', game_objectives='${game_objectives}' WHERE game_id='${game_id}'`;
    dbConnection.query(
      sql,
     async (err,result)=>
      {
        if(err) reject(err);
        resolve(result)
      }
    )
  })
}

function deleteGame(game_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`DELETE FROM pin_codes WHERE game_id='${game_id}'`

    dbConnection.query(
      sql,
    async  (err,result)=>
      {
        if(err)reject(err);
        resolve(result)
      }
    )

    
  })
}

function searchGames(search_query,pageNumber) {
  return new Promise((resolve, reject) => {
    let sql = `
    SELECT games.*, COUNT(categories.category_id) AS total_categories, COUNT(products.product_id) AS total_products  
    FROM games 
    LEFT JOIN categories ON categories.game_id = games.game_id 
    LEFT JOIN products ON products.game_id = games.game_id 
    WHERE game_name LIKE '%${search_query}%'
    GROUP BY games.game_id `;

    let countSql = `
    SELECT COUNT(*) AS totalRecords 
    FROM (
      SELECT games.game_id
      FROM games 
      LEFT JOIN categories ON categories.game_id = games.game_id 
      LEFT JOIN products ON products.game_id = games.game_id 
      WHERE games.game_name LIKE '%${search_query}%'
      GROUP BY games.game_id
    ) AS subquery
  `;

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


module.exports = { insertGame, getGames, updateGame, deleteGame, searchGames };
