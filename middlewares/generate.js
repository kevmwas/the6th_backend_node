const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { keyEncrypt } = require("./encryption");
const GenerateKeyPair = require("../config/keys");

const passPhrase = `All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.
The people may exercise their sovereign power either directly or through their democratically elected representatives.`;

const GenerateToken = (content, TokenIssuer, expiry) => {
  if (!fs.existsSync(`${path.resolve(process.cwd())}/keys/public.pem`) && !fs.existsSync(`${path.resolve(process.cwd())}/keys/private.pem`)) {
    GenerateKeyPair();
  }

  const privateKey = fs.readFileSync(
    `${path.resolve(process.cwd())}/keys/private.pem`,
    "utf8"
  );

  const encryptedData = keyEncrypt(content);
  try {

    const token = jwt.sign(
      { payload: encryptedData },
      {
        key: privateKey.replace(/\\n/gm, "\n"),
        passphrase: passPhrase,
      },
      {
        issuer: TokenIssuer,
        algorithm: "RS512",
        expiresIn:
          expiry === undefined || expiry === null || expiry === ""
            ? "30d"
            : expiry,
      }
    );
    return token;
  } catch (error) {
   return {status: 500, error: "Error Generating token"}
  }
};

module.exports = GenerateToken;
