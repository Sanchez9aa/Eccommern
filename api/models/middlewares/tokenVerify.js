const jwt = require("jsonwebtoken");
const axios = require("axios");

const tokenVerify = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SK, (err, user) => {
      if (err) res.status(401).json("Token not valid");
      console.log(user);
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You need to authenticate!");
  }
};

const authVerify = (req, res, next) => {
  tokenVerify(req, res, async () => {
    try {
      const user = await axios.get(
        `http://localhost:8800/api/users/${req.user.id}`
      );
      if (user.data.isAdmin) {
        next();
      } else {
        res.status(403).json({message:"Not autorized", success: false});
      }
    } catch (err) {
      res.status(403).json({message:`${err}`, success: false});
    }
  });
};

module.exports = { tokenVerify, authVerify };
