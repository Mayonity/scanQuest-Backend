const query = require("express");
const dbConnection = require("../db_connection/connection");


function getFields(game_id)
{
    return new Promise((resolve, reject) => {
       
        const sql =`SELECT * FROM fields WHERE game_id=${game_id}`;
        dbConnection.query(
          sql,
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
}

function insertField(fieldData) {
  return new Promise((resolve, reject) => {
    const { label, value, type, status, game_id } = fieldData;
    const sql = `INSERT INTO fields (label, value, type,status, game_id) VALUES ('${label}', '${value}', '${type}', '${status}', ${game_id})`;

    dbConnection.query(
      sql,
      [label, value, type, status,game_id],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function updateField(fieldData)
{
  const {field_id,label, value, type, status}=fieldData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE fields SET label='${label}', value='${value}', type='${type}', status='${status}' WHERE field_id='${field_id}'`;
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

function deleteField(field_id)
{
  return new Promise((resolve,reject)=>
  {
    const sql=`DELETE FROM fields WHERE field_id='${field_id}'`

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


module.exports = { insertField, getFields, updateField, deleteField };
