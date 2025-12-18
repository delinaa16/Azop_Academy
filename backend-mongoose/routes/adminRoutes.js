const express = require("express");
const { login, registerFirstAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/login", login);
router.post("/register-first", registerFirstAdmin);

module.exports = router;
