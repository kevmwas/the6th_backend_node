const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const IsAuthenticated = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

router.post("/create-user", IsAuthenticated, upload.single("image"), users.createUser);

router.get("/all-users", IsAuthenticated, users.getAllUsers);

router.get("/one-user/:id", IsAuthenticated, users.getUserById);

router.patch("/update-user/:id", IsAuthenticated, upload.single("image"), users.updateUser);

router.delete("/delete-user/:id", IsAuthenticated, users.deleteUser);

module.exports = router;
