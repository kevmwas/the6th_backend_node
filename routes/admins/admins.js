const express = require("express");
const router = express.Router();
const admins = require("../controllers/admin");
const IsAdminAuthenticated = require("../middlewares/adminAuth");
const upload = require("../middlewares/upload");

router.get("/all-admins", IsAdminAuthenticated, admins.allAdmins);

router.get("/admin/:id", IsAdminAuthenticated, admins.getAdminById);

router.post("/create-admin", IsAdminAuthenticated, upload.single("image"), admins.createAdmin);

router.patch("/update-admin/:id", IsAdminAuthenticated, upload.single("image"), admins.updateAdmin);

router.patch("/update-admin-password/:id", IsAdminAuthenticated, admins.updateAdminPassword);

router.patch("/update-my-password", IsAdminAuthenticated, admins.updateMyAdminPassword);

module.exports = router;
