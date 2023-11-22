const {
  insertStudent,
  getStudents,
  updateGame,
  deleteStudent,
  searchStudent,
  getProductDetails,
  getExportedData
} = require("../Services/studentsService");

async function getAllRecords(req, res) {
  try {

    const { orderBy, order } = req.query;
    
    const result = await getStudents(orderBy,order,req.query.pageSize,req.query.pageNumber,req.query.game_id);
 

    result.data.forEach((item, index) => {
      // Parse 'products' from string to array
      const innerJsonString = item.products.replace(/^"|"$/g, ""); // Remove surrounding double quotes
      result.data[index].products = JSON.parse(innerJsonString);
  
      // Rename 'student_class' to 'class'
      result.data[index].class = result.data[index].student_class;
      delete result.data[index].student_class;
  
      // Add 'name' property
      const { student_name, ...rest } = result.data[index];
      result.data[index] = { ...rest, name: student_name };
    });
  
  
  
    res
      .status(200)
      .json({ message: "Students fetched successfully", data: result });
  } catch (err) {
    console.error("Error fetching games:", err.message);
    res.status(500).json({ error: "Error fetching student records. Please refresh the page and try again." });
  }
}

async function insertRecord(req, res) {
  try {
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
    } = req.body;

    const studentData = {
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
    };
    const result = await insertStudent(studentData);
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("Error adding student:", err.message);
    res.status(500).json({ error: "Error adding student. Please refresh the page and try again." });
  }
}

async function updateRecord(req, res) {
  try {
    const { game_name, game_objectives } = req.body;

    const game_id = req.params.game_id;
    const gameData = { game_id, game_name, game_objectives };
    const result = await updateGame(gameData);
    res.status(200).json({ message: "Game Updated Successfully" });
  } catch (err) {
    console.error("Error updating game:", err.message);
    res.status(500).json({ error: "Error updating student. Please refresh the page and try again." });
  }
}

async function deleteRecord(req, res) {
  try {
    const student_id = req.params.student_id;

    console.log(typeof(student_id))
    const numbersArray = student_id.split(',');
    const result = await deleteStudent(numbersArray);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Error deleting record:", err.message);
    res.status(500).json({ error: "Error deleting student. Please refresh the page and try again." });
  }
}

async function searchRecord(req, res) {
  try {
    const {search_query,game_id,student_class,current_page} = req.body;
    const result = await searchStudent(search_query,game_id,student_class,current_page);
    result.data.forEach((item, index) => {
      // Parse 'products' from string to array
      const innerJsonString = item.products.replace(/^"|"$/g, ""); // Remove surrounding double quotes
      result.data[index].products = JSON.parse(innerJsonString);
  
      // Rename 'student_class' to 'class'
      result.data[index].class = result.data[index].student_class;
      delete result.data[index].student_class;
  
      // Add 'name' property
      const { student_name, ...rest } = result.data[index];
      result.data[index] = { ...rest, name: student_name };
    });
  
  
    res.status(200).json({ message: "Search done successfully", data: result });
  } catch (err) {
    console.error("Error searching records:", err.message);
    res.status(500).json({ error: "Error searching students. Please refresh the page and try again." });
  }
}

async function getAllProducts(req, res) {
  try {
    let result = [];

    let { products } = req.body;

    console.log(products)
    // products = JSON.parse(products.trim());

    console.log(products)
    await Promise.all(
      products.map(async (element) => {
        const productDetails = await getProductDetails(element.product_id);
       

          productDetails[0].quantity=element.quantity
          productDetails[0].price=element.cost
     
        result.push(productDetails[0]);
      })
    );

    result.forEach(element => {
      element.image = `${req.protocol}://${req.get('host')}/uploads/${element.image}`;

    });
    res
      .status(200)
      .json({ message: "products retrieved successfully", data: result });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function exportRecord(req,res)
{
  try {

 
    
    const result = await getExportedData();

    result.map((element) => {
  
      const innerJsonString = element.products.replace(/^"|"$/g, ""); // Remove surrounding double quotes
      const fieldJson = element.fields.replace(/^"|"$/g, ""); // Remove surrounding double quotes
      element.products = JSON.parse(innerJsonString);
      element.fields=JSON.parse(fieldJson)
      
    });

    const updatedData = result.map(item => {
      const { student_class, student_name,...rest } = item; // Destructure the object, removing the pin_code property
      return { ...rest, class: student_class, name:student_name }; // Spread the rest of the properties and add the updated code property
    });
    res
      .status(200)
      .json({ message: "Students fetched successfully", data: updatedData });
  } catch (err) {
    console.error("Error fetching games:", err.message);
    res.status(500).json({ error: "Error fetching student records. Please refresh the page and try again." });
  }
}

module.exports = {
  insertRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  searchRecord,
  getAllProducts,
  exportRecord
};
