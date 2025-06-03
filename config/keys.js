const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const GenerateKeyPair = () => {
  try {
    const keyPair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const directory = "./keys";

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    if (
      !fs.existsSync(`${path.resolve(process.cwd())}/keys/public.pem`) &&
      !fs.existsSync(`${path.resolve(process.cwd())}/keys/private.pem`)
    ) {
      fs.writeFileSync(directory + "/public.pem", keyPair.publicKey);
      fs.writeFileSync(directory + "/private.pem", keyPair.privateKey);
    }

    return {};
  } catch (error) {
    return error;
  }
};

module.exports = GenerateKeyPair;
