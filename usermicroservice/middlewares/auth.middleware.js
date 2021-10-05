const jwt = require("jsonwebtoken");
const redisClient = require("../redis_connect");

function verifyAccessToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.send({ message: "Not authorized", data: error });
  }
}

function verifyRefreshToken(req, res, next) {
  const token = req.body.token;
  if (token === null)
    return res.status(401).json({ status: false, message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_ACCESS_TOKEN);
    req.userData = decoded;
    redisClient.get(decoded._id.toString(), (err, data) => {
      if (err) throw err;

      if (data === null)
        return res.send({ message: "Not authorized, token not in stored" });

      if (JSON.parse(data).token != token) {
        return res.send({
          message: "Not authorized, token not in same stored",
        });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized", data: error });
  }
}

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
