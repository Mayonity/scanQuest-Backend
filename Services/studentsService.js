const query = require("express");
const dbConnection = require("../db_connection/connection");

function getStudents(orderBy,order,pageSize,pageNumber,game_id) {

  return new Promise((resolve, reject) => {
    const offset = (pageNumber - 1) * pageSize;
    let sql = `SELECT * FROM students `;

    const countSql='SELECT COUNT(*) AS totalRecords FROM students'
        

    if(game_id!==undefined)
    {
      // console.log(pin_code)
     sql+=` WHERE students.game_id=${game_id} `
    }
    if(order!==undefined && orderBy!==undefined)
    {
      sql+=` ORDER BY ${orderBy} ${order}`
    }
    if(pageSize!==undefined || pageNumber!==undefined)
    {
      sql+=` LIMIT ${pageSize} OFFSET ${offset} `
    }
    console.log(sql)
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

function insertStudent(studentData) {
  return new Promise((resolve, reject) => {
    const {
      pin_code,
      student_class,
      student_name,
      total_guests,
      available_fund,
      total_cost,
      total_happiness_rating,
      balance_shortfall,
      adjusted_happiness_rating,
      products,
      code_id,
      game_id
    } = studentData;

    const sql = `INSERT INTO students (pin_code,student_class, student_name, total_guests, available_fund, total_cost, total_happiness_rating,
       balance_shortfall, adjusted_happiness_rating,products,code_id, game_id)
     VALUES (${pin_code},'${student_class}', '${student_name}', ${total_guests}, ${available_fund}, ${total_cost}, ${total_happiness_rating},
     ${balance_shortfall}, ${adjusted_happiness_rating}, '${JSON.stringify(
      products
    )}', ${code_id},${game_id})`;

    dbConnection.query(
      sql,
      [
        pin_code,
        student_class,
        student_name,
        total_guests,
        available_fund,
        total_cost,
        total_happiness_rating,
        balance_shortfall,
        adjusted_happiness_rating,
        products,
        code_id
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
    const sql = `DELETE FROM students WHERE student_id IN (${student_id})`;

    dbConnection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function searchStudent(search_query,game_id,student_class,pageNumber) {
  console.log(search_query)
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM students';
    let countSql=`SELECT COUNT(*) AS totalRecords from students`
    // Check if search_query or student_class is provided and add WHERE clause accordingly
    if (search_query || game_id || student_class) {
      sql += ' WHERE ';
      countSql += ' WHERE ';
      const conditions = [];
    
      if (search_query) {
        conditions.push(`student_name LIKE '%${search_query}%'`);
      }
    
      if (game_id) {
        conditions.push(`game_id='${game_id}'`);
      }
      if(student_class)
      {
        conditions.push(`student_class='${student_class}' `)
      }
    
      sql += conditions.join(' AND ');
      countSql += conditions.join(' AND ');
    }
  
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

function getProductDetails(product_id) {
  console.log(product_id);
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM products WHERE product_id='${product_id}'`;

    dbConnection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}


function getExportedData() {

  return new Promise((resolve, reject) => {
    let sql = `
    SELECT 
        students.*,
        CONCAT('[', 
            GROUP_CONCAT(
                JSON_OBJECT(
                    'field_id', field_id,
                    'label', label,
                    'value', value,
                    'type', type,
                    'status', status
                )
                SEPARATOR ','
            ),
        ']') AS fields
    FROM students
    LEFT JOIN games ON students.game_id = games.game_id
    LEFT JOIN fields ON games.game_id = fields.game_id
    WHERE fields.label NOT IN ('class','name','available funds','total games','total guests')
    GROUP BY students.student_id;
    `;
    

   
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
  getExportedData
};
