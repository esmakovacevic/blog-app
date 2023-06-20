const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    const verifiedToken = jwt.verify(token, process.env.NEXT_PUBLIC_SUPABASE_JWT_KEY);
    console.log(decodedToken)
    const email = verifiedToken.email;
    req.email = email; 
    next(); 
  } catch (error) {
    console.error("Error authenticating token:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authenticateToken };
