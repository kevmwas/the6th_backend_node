const express = require("express");
const auth = require("./auth");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/",
    route: auth,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
