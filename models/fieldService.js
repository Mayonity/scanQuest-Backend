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
    const { field_label, field_value, field_type, field_predefine, game_id  } = fieldData;
    const sql = `INSERT INTO fields (field_label, field_value, field_type,field_predefine, game_id) VALUES ('${field_label}', '${field_value}', '${field_type}', '${field_predefine}', ${game_id})`;

    dbConnection.query(
      sql,
      [field_label, field_value, field_type, field_predefine],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function updateField(fieldData)
{
  const {field_id,field_label, field_value, field_type, field_predefine}=fieldData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE fields SET field_label='${field_label}', field_value='${field_value}', field_type='${field_type}', field_predefine='${field_predefine}' WHERE field_id='${field_id}'`;
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
