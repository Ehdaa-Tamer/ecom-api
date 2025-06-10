const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// Basic CRUD
router.get("/", userController.getUsers);
router.get("/:id",userController.protect, userController.getUserById);

router.post("/", userController.signUp);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);



module.exports = router;
