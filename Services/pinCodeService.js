const query = require("express");
const dbConnection = require("../db_connection/connection");
const { insertStudentFields } = require("../controllers/fieldControllers");


function validateCode(codeData)
{
  return new Promise((resolve, reject) => {
  const {pin_code,code_for}=codeData
  const sql =`SELECT * FROM pin_codes INNER JOIN games on games.game_id=pin_codes.game_id Where pin_code=${pin_code} AND code_for='${code_for}'`;
  dbConnection.query(
    sql,
    (err, result) => {
      if (err) reject(err);
      resolve(result);
    }
  );
});
}

function getPinCodes(pageSize, pageNumber)
{
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM pin_codes INNER JOIN games ON games.game_id = pin_codes.game_id ORDER BY pin_codes.code_id DESC' ;
    let countSql = 'SELECT COUNT(*) AS totalRecords FROM pin_codes INNER JOIN games ON games.game_id = pin_codes.game_id';
    
    // Check if pageSize and pageNumber are provided
    if (pageSize && pageNumber) {
      const offset = (pageNumber - 1) * pageSize;
      sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
    }
    
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

function insertPinCode(pinCodeData,current_page) {
  return new Promise((resolve, reject) => {
    const { code_for, pin_code ,game_id } = pinCodeData;
    const sql = `INSERT INTO pin_codes (pin_code ,code_for ,game_id) VALUES ('${pin_code}','${code_for}', ${game_id})`;

    dbConnection.query(
      sql,
      [code_for, game_id ],
     async (err, result) => {
        if (err) reject(err);
        insertStudentFields(result.insertId,game_id)
        const pin_codes=await getPinCodes(10,current_page)
        resolve(pin_codes)
      }
    );
  });
}

function updatePinCode(pinCodeData)
{
  const {code_id,pin_code,code_for,game_id}=pinCodeData
  return new Promise((resolve,reject)=>
  {
    const sql=`UPDATE pin_codes SET pin_code='${pin_code}', code_for='${code_for}', game_id=${game_id} WHERE code_id='${code_id}'`;
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

function searchPinCodes(search_query, code_for, game_id, pageNumber) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM pin_codes INNER JOIN games ON pin_codes.game_id = games.game_id';
    let countSql = 'SELECT COUNT(*) AS totalRecords FROM pin_codes INNER JOIN games ON pin_codes.game_id = games.game_id';

    // Check if search_query, code_for, or game_id is provided and add WHERE clause accordingly
    if (search_query || code_for || game_id) {
      sql += ' WHERE ';
      countSql += ' WHERE ';
      const conditions = [];

      if (search_query) {
        conditions.push(`pin_code LIKE '%${search_query}%'`);
      }

      if (code_for) {
        conditions.push(`code_for='${code_for}'`);
      }

      if (game_id) {
        conditions.push(`pin_codes.game_id = ${game_id}`);
      }

      sql += conditions.join(' AND ');
      countSql += conditions.join(' AND ');
    }

    if (pageNumber) {
      const offset = (pageNumber - 1) * 10;
      sql += ` LIMIT ${10} OFFSET ${offset}`;
    }

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


function checkForUniquePIN(pin,game_id=null) {

  let sql
  if(game_id!==null)
  {
    sql=`SELECT * FROM pin_codes WHERE pin_code= ${pin} OR game_id=${game_id} AND code_for='Trainer'`
  }
  else
  {
    sql=`SELECT * FROM pin_codes WHERE pin_code = ${pin}`
  }
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length === 0); // Resolve true if PIN is unique, false if it exists
      }
    });
  });
}

module.exports = {validateCode ,insertPinCode, getPinCodes, updatePinCode, deleteCategory, searchPinCodes, checkForUniquePIN };
