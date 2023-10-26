const query = require("express");
const dbConnection = require("../db_connection/connection");


function getPinCodes()
{
    return new Promise((resolve, reject) => {
       
        const sql ='SELECT * FROM pin_codes INNER JOIN games on games.game_id=pin_codes.game_id';
        dbConnection.query(
          sql,
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
}

function insertPinCode(pinCodeData) {
  return new Promise((resolve, reject) => {
    const { code_for, pin_code ,game_id } = pinCodeData;
    const sql = `INSERT INTO pin_codes (pin_code ,code_for ,game_id) VALUES ('${pin_code}','${code_for}', ${game_id})`;

    dbConnection.query(
      sql,
      [code_for, game_id ],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function updatePinCode(pinCodeData)
{
  const {code_id,pin_code,code_for}=pinCodeData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE pin_codes SET pin_code='${pin_code}', code_for='${code_for}' WHERE code_id='${code_id}'`;
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

function deleteCategory(code_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`DELETE FROM pin_codes WHERE code_id='${code_id}'`

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

function searchPinCodes(search_query, code_for, game_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`SELECT * FROM pin_codes inner join games on pin_codes.game_id=games.game_id WHERE pin_code LIKE '%${search_query}%' OR code_for='${code_for}' OR pin_codes.game_id=${game_id}`

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

module.exports = { insertPinCode, getPinCodes, updatePinCode, deleteCategory, searchPinCodes };
