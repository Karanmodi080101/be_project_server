// Third party modules
const { check } = require("express-validator");
const express = require("express");

// Self modules
const {
  signup,
  getUser,
  deleteUser,
  updateUser,
  login,
} = require("../services");
const { verifyUser } = require("../middleware/auth");
const { logout } = require("../services/user");
// const { login } = require("../services/user");

const router = new express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with more than 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  signup
);

// login route
router.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with more than 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  login
);

router.post("/logout", verifyUser, logout);

router.get("/me", verifyUser, getUser);

router.delete("/me", verifyUser, deleteUser);

router.patch("/me", verifyUser, updateUser);

module.exports = router;
