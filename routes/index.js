const express = require("express");
const auth = require("./auth");

const router = express.Router();
// TODO add new models for support (these will be issues raised and will help in keeping check of the said unit and apartment for rating purposes)
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
