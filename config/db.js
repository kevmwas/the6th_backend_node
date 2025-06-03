const Sequelize = require("sequelize");
const config = require("./config.json");
require('dotenv').config();

const host = config.development.host;
const user = config.development.user;
const password = config.development.password;
const port = 3306;
const database = config.development.database;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize.beforeConnect(async () => {
  const { Client } = require('pg');
  const client = new Client({
    host: host,
    port: port,
    user: user,
    password: password
  });
  await client.connect();
  await client.query("CREATE DATABASE the_6th;");
  await client.end();
});

module.exports = sequelize;
