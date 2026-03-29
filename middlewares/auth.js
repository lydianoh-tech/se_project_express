const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new UnauthorizedError("Authorization required"));
  }

  req.user = payload; // why: attaching user info to request for downstream use
  return next();
};
