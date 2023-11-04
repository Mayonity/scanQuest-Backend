const query = require("express");
const dbConnection = require("../db_connection/connection");


function getGames()
{
    return new Promise((resolve, reject) => {
       
        const sql ='SELECT * FROM games';
        dbConnection.query(
          sql,
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
}

function insertGame(gameData) {
  return new Promise((resolve, reject) => {
    const { game_name, game_objectives } = gameData;

    const sql = `INSERT INTO games (game_name, game_objectives) VALUES ('${game_name}', '${game_objectives}')`;

    dbConnection.query(
      sql,
      [game_name, game_objectives],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
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
      (err,result)=>
      {
        if(err) reject(err);
        resolve(result);
      }
    )
  })
}

function deleteGame(game_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`DELETE FROM games WHERE game_id='${game_id}'`

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

function searchGames(search_query)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`SELECT * FROM games WHERE game_name LIKE '%${search_query}%'`

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

module.exports = { insertGame, getGames, updateGame, deleteGame, searchGames };
