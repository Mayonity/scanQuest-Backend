const {
  insertStudent,
  getStudents,
  updateGame,
  deleteStudent,
  searchStudent,
  getProductDetails,
} = require("../Services/studentsService");

async function getAllRecords(req, res) {
  try {
    const result = await getStudents();

    result.map((element) => {
      const innerJsonString = element.products.replace(/^"|"$/g, ""); // Remove surrounding double quotes
      element.products = JSON.parse(innerJsonString);
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
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function insertRecord(req, res) {
  try {
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
    } = req.body;

    const studentData = {
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
    };
    const result = await insertStudent(studentData);
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("Error adding student:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteRecord(req, res) {
  try {
    const student_id = req.params.student_id;

    const result = await deleteStudent(student_id);
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Error deleting record:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function searchRecord(req, res) {
  try {
    const {search_query,student_class} = req.body;
    const result = await searchStudent(search_query,student_class);
    result.map((element) => {
      const innerJsonString = element.products.replace(/^"|"$/g, ""); // Remove surrounding double quotes
      element.products = JSON.parse(innerJsonString);
    });

    const updatedData = result.map(item => {
      const { student_class, student_name,...rest } = item; // Destructure the object, removing the pin_code property
      return { ...rest, class: student_class, name:student_name }; // Spread the rest of the properties and add the updated code property
    });
    res.status(200).json({ message: "Search done successfully", data: updatedData });
  } catch (err) {
    console.error("Error searching records:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllProducts(req, res) {
  try {
    let result = [];

    let { products } = req.body;

    // products = JSON.parse(products.trim());

    await Promise.all(
      products.map(async (element) => {
        const productDetails = await getProductDetails(element.product_id);
        productDetails[0].quantity=element.quantity
        productDetails[0].price=element.price
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
module.exports = {
  insertRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  searchRecord,
  getAllProducts,
};
