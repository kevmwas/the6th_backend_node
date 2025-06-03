const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const TokenIssuer = config.development.issuer;
const { keyDecrypt } = require("./encryption");

const IsAuthenticated = (req, res, next) => {
  try {
    const folderPath = path.resolve(`${process.cwd()}/keys`);
    const privateKey = fs.readFileSync(`${folderPath}/private.pem`, "utf8");

    const token = req.headers.authorization?.split(" ");
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Please add token headers" });
    }
    if (token[0] === "Bearer" && token[1].match(/\S+\.\S+\.\S+/) !== null) {
      jwt.verify(
        token[1],
        privateKey,
        { issuer: TokenIssuer, algorithms: ["RS512"], header: { typ: "" } },

        function (err, decoded) {
          if (err) {
            res.status(401).json({ message: "Expired or invalid token" });
          } else {
            const decodedData = keyDecrypt(decoded.payload);
            const data = JSON.parse(decodedData);

            req.user = data;
            next();
          }
        }
      );
    } else {
      res.status(401).json({ message: "Token not provided" });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: error,
    });
  }
};

module.exports = IsAuthenticated;
