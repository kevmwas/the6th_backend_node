const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Users = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  otp_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otp_expiration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "default.png",
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  county: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sub_county: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_of_birth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  next_of_kin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  next_of_kin_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  next_of_kin_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "tenant",
    enum: ["tenant", "visitor", "landlord", "caretaker", "dependant"],
  },
  comments: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rating: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Users;
