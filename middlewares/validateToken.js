const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: Token not provided' });
  }

  try {
  

    const decoded = jwt.verify(token.split(' ')[1], process.env.CLIENT_SECRET);
  
    req.user = decoded; // Add user information to the request object for further use
    next(); // Move to the next middleware
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Unauthenticated' });
  }
};

module.exports=verifyToken
