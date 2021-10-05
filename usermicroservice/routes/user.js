const express = require("express");

const userController = require("../controllers/user");
const userMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/dashboard", verifyAccessToken, (req, res) => {
  res.send("hello from dashboard");
});

router.post("/registeruser", userController.Register);

router.post("/login", userController.Login);

router.post("/logout", userMiddleware.verifyAccessToken, userController.Logout);

router.post("/token", userMiddleware.verifyRefreshToken, userController.Token);

module.exports = router;
