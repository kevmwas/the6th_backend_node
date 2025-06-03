const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");

router.get("/", auth.landing);

router.post("/login", auth.userLogin);

router.post("/sign-up", auth.signUp);

router.post("/forgot-password", auth.forgotPassword);

module.exports = router;
