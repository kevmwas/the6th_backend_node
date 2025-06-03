const User = require("../models/users");
const Admin = require("../models/admins");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const TokenIssuer = config.development.issuer;
const AdminTokenIssuer = config.development.admin_issuer;
const GenerateToken = require("../middlewares/generate");

const isEmail = (input) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(input);
};

const landing = (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
};

const userLogin = async (req, res) => {
  try {
    let loginInput;
    if (!isEmail(req.body.loginInput)) {
      loginInput = {
        phone: req.body.loginInput,
        status: true,
        is_deleted: false,
      };
    } else {
      loginInput = {
        email: req.body.loginInput,
        status: true,
        is_deleted: false,
      };
    }

    const user = await User.findOne({
      where: loginInput,
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid login credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }

    const tokenData = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      country: user.country,
      county: user.county,
      sub_county: user.sub_county,
      location: user.location,
      image: user.image,
      role: user.role,
    };

    const token = GenerateToken(JSON.stringify(tokenData), TokenIssuer);

    res.status(200).json({ data: token, user: tokenData });
  } catch (error) {
    res.status(500).json({ message: "Error happening during login" });
  }
};

const adminLogin = async (req, res) => {
  try {
    let loginInput;
    if (!isEmail(req.body.loginInput)) {
      loginInput = {
        phone: req.body.loginInput,
        status: true,
        is_deleted: false,
      };
    } else {
      loginInput = {
        email: req.body.loginInput,
        status: true,
        is_deleted: false,
      };
    }

    const admin = await Admin.findOne({
      where: loginInput,
    });

    if (!admin) {
      return res.status(404).json({ message: "Invalid login credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      admin.password,
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }

    const tokenData = {
      id: admin.id,
      email: admin.email,
      first_name: admin.first_name,
      last_name: admin.last_name,
      phone: admin.phone,
      country: admin.country,
      county: admin.county,
      sub_county: admin.sub_county,
      location: admin.location,
      image: admin.image,
      role: admin.role,
    };

    const token = GenerateToken(JSON.stringify(tokenData), AdminTokenIssuer);

    res.status(200).json({ data: token, admin: tokenData });
  } catch (error) {
    res.status(500).json({ message: "Error happening during login" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    let loginInput;
    if (!isEmail(req.body.loginInput)) {
      loginInput = { phone: req.body.loginInput, status: true };
    } else {
      loginInput = { email: req.body.loginInput, status: true };
    }

    const user = await User.findOne({
      where: loginInput,
    });

    // generate otp and send email or text
    // TODO check, create and have emails ready
  } catch (error) {
    res.status(500).json({ message: "error resetting password" });
  }
};

module.exports = { landing, userLogin, adminLogin, forgotPassword };
