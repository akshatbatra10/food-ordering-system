const express = require("express");

const userController = require("../controllers/user");
const userMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/dashboard", userMiddleware.verifyAccessToken, (req, res) => {
  res.send("hello from dashboard");
});

router.get("/info/:id", userController.Details);

router.post("/bookmark", userController.AddToWishList);

router.post("/removebookmark", userController.RemoveFromWishList);

router.post("/registeruser", userController.Register);

router.post("/login", userController.Login);

router.post("/logout", userMiddleware.verifyAccessToken, userController.Logout);

router.post("/token", userMiddleware.verifyRefreshToken, userController.Token);

module.exports = router;
