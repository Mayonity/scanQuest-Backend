const query = require("express");
const dbConnection = require("../db_connection/connection");



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


function authenticateAdmin(adminData)
{
  return new Promise((resolve, reject) => {
  const {email,password}=adminData
  const sql =`SELECT * FROM admin WHERE email='${email}' AND password='${password}'`;
  dbConnection.query(
    sql,
    (err, result) => {
      if (err) reject(err);
      resolve(result);
    }
  );
});
}

function updatePassword(password)
{
  return new Promise((resolve, reject) => {

    const sql =`UPDATE admin SET password='${password}' WHERE email='admin@gmail.com'`;
    dbConnection.query(
      sql,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

module.exports={validateCode, authenticateAdmin, updatePassword}