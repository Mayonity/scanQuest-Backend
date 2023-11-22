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
    console.log(fieldData)
    const { label, value, type, status, game_id } = fieldData;
    const sql = `INSERT INTO fields (label, value, type,status, game_id) VALUES ('${label}', '${value}', '${type}', '${status===true?1:0}', ${game_id})`;

    dbConnection.query(
      sql,
      [label, value, type, status,game_id],
     async (err, result) => {
        if (err) reject(err);
        const pin_codes= await getGamePinCodes(game_id)

        const id=result.insertId

        await pin_codes.forEach(element => {
            fieldData.code_id=element.code_id
            fieldData.field_id=id
            insertStudentField(fieldData)
         });
        const allFields=await getFields(game_id)
        resolve(allFields);
      }
    );
  });
}

function updateField(fieldData)
{
  const {field_id,label, value, type, status, game_id}=fieldData
  console.log("fieldDa ",fieldData)
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE fields SET label='${label}', value='${value}', type='${type}', status='${status===true?1:0}' WHERE field_id='${field_id}'`;
    dbConnection.query(
      sql,
     async (err,result)=>
      {
        if(err) reject(err);
        console.log(result)
        const pin_codes= await getGamePinCodes(game_id)
       
        pin_codes.forEach(element => {
           fieldData.code_id=element.code_id
           fieldData.field_id=field_id
           updateStudentFieldsValsOnPin(fieldData)
        });
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



function insertStudentField(fieldData)
{
  console.log(fieldData)
  return new Promise((resolve, reject) => {
    const { label, value, type, status , code_id, field_id} = fieldData;
    const sql = `INSERT INTO student_fields (label, value, type,status, code_id, field_id) VALUES ('${label}', '${value}', '${type}', '${status===true?1:0}', ${code_id}, ${field_id})`;

    dbConnection.query(
      sql,
      [label, value, type, status,code_id, field_id],
     async (err, result) => {
        if (err) reject(err);
        
        resolve(result);
      }
    );
  });
}


function updateStudentFieldsVals(fieldData)
{
  const {id,label, value, type, status}=fieldData
  console.log(fieldData)
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE student_fields SET label='${label}', value='${value}', type='${type}', status='${status===true?1:0}' WHERE id='${id}'`;
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


function updateStudentFieldsValsOnPin(fieldData)
{
  const {code_id,label, value, type, status, field_id}=fieldData
  console.log(fieldData)
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE student_fields SET label='${label}', value='${value}', type='${type}', status='${status===true?1:0}' WHERE field_id='${field_id}'`;
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

function getAllStudentFields(code_id)
{
  return new Promise((resolve, reject) => {
      
    const sql =`SELECT * FROM student_fields WHERE code_id=${code_id} `;
    dbConnection.query(
      sql,
      (err, result) => {
        if (err) reject(err);
        
        resolve(result);
      }
    );
  });
}


function getGamePinCodes(game_id)
{
  return new Promise((resolve, reject) => {
 
      const sql =`SELECT * FROM pin_codes INNER JOIN games on games.game_id=pin_codes.game_id WHERE pin_codes.game_id=${game_id}  AND code_for='Student'` ;

      dbConnection.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
        resolve(result)
        }
      });
    });
}

module.exports = { insertField, getFields, updateField, deleteField , insertStudentField, updateStudentFieldsVals, getAllStudentFields};
