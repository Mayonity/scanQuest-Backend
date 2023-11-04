const query = require("express");
const dbConnection = require("../db_connection/connection");

function getStudents() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM students";
    dbConnection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function insertStudent(studentData) {
  return new Promise((resolve, reject) => {
    const {
      student_id,
      student_class,
      student_name,
      total_guests,
      available_fund,
      total_cost,
      total_happiness_rating,
      balance_shortfall,
      adjusted_happiness_rating,
      products,
    } = studentData;

    const sql = `INSERT INTO students (student_id,student_class, student_name, total_guests, available_fund, total_cost, total_happiness_rating,
       balance_shortfall, adjusted_happiness_rating,products)
     VALUES (${student_id},'${student_class}', '${student_name}', ${total_guests}, ${available_fund}, ${total_cost}, ${total_happiness_rating},
     ${balance_shortfall}, ${adjusted_happiness_rating}, '${JSON.stringify(
      products
    )}')`;

    dbConnection.query(
      sql,
      [
        student_id,
        student_class,
        student_name,
        total_guests,
        available_fund,
        total_cost,
        total_happiness_rating,
        balance_shortfall,
        adjusted_happiness_rating,
        products,
      ],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}
function updateGame(gameData) {
  const { game_id, game_name, game_objectives } = gameData;
  return new Promise((resolve, reject) => {
    const sql = `UPDATE games SET game_name='${game_name}', game_objectives='${game_objectives}' WHERE game_id='${game_id}'`;
    dbConnection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function deleteStudent(student_id) {
  console.log(student_id)
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM students WHERE student_id IN ('${student_id}')`;

    dbConnection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function searchStudent(search_query,student_class) {
  console.log(search_query)
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM students';

    // Check if search_query or student_class is provided and add WHERE clause accordingly
    if (search_query || student_class) {
      sql += ' WHERE ';
      const conditions = [];
    
      if (search_query) {
        conditions.push(`student_name LIKE '%${search_query}%'`);
      }
    
      if (student_class) {
        conditions.push(`student_class='${student_class}'`);
      }
    
      sql += conditions.join(' AND ');
    }
    dbConnection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function getProductDetails(product_id) {
  console.log(product_id);
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM products WHERE product_id=${product_id}`;

    dbConnection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports = {
  insertStudent,
  getStudents,
  updateGame,
  deleteStudent,
  searchStudent,
  getProductDetails,
};
