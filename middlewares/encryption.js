const {
    randomBytes,
    pbkdf2Sync,
    createCipheriv,
    createDecipheriv,
    publicEncrypt,
    privateDecrypt,
  } = require("crypto");
  const GenerateKeyPair = require("../config/keys");
  const path = require("path");
  const fs = require("fs");
  const EncryptionSecret =
    `(1) All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.
    (2) The people may exercise their sovereign power either directly or through their democratically elected representatives.`;
  
  if (
    !fs.existsSync(`${path.resolve(process.cwd())}/keys/public.pem`) &&
    !fs.existsSync(`${path.resolve(process.cwd())}/keys/private.pem`)
  ) {
    GenerateKeyPair();
  }
  
  const EncodeText = (string) => {
    try {
      const encoder = new TextEncoder();
      const encStr = encoder.encode(string);
  
      const arrayFromString = Array.from(encStr, (point) => point.toString(16));
  
      const returnString = arrayFromString.join("");
  
      return returnString;
    } catch (error) {
      return { error: "Error encoding text" };
    }
  };
  
  const DecodeText = (string) => {
    try {
      const decoder = new TextDecoder();
      const hexArr = string.match(/../g);
      const buffer = Uint8Array.from(hexArr, (point) => parseInt(point, 16));
  
      const text = decoder.decode(buffer);
  
      return text;
    } catch (error) {
      return { error: "Error Decoding text" };
    }
  };
  
  const Encryption = (salt, text) => {
    try {
      const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
      const byteHex = (n) => ("0" + Number(n).toString(16)).slice(-2);
      const applySaltToChar = (code) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);
  
      return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
    } catch (error) {
      return { error: "Text encryption error, unable to encrypt the data" };
    }
  };
  
  const Decryption = (salt, encoded) => {
    try {
      const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
      const applySaltToChar = (code) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);
  
      return encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
    } catch (error) {
      return { error: "Error decrypting the given data" };
    }
  };
  
  const EncryptText = (encryptionSalt, text) => {
    const encodedText = EncodeText(text);
    return Encryption(encryptionSalt, encodedText);
  };
  
  const DecryptText = (encryptionSalt, text) => {
    const decrypted = Decryption(encryptionSalt, text);
    return DecodeText(decrypted);
  };
  
  const keyEncrypt = (plain) => {
    try {
      const folderPath = path.resolve(`${process.cwd()}/keys`);
      const publicKey = fs.readFileSync(`${folderPath}/public.pem`, "utf8");
  
      return publicEncrypt(
        {
          key: publicKey,
        },
        Buffer.from(plain)
      ).toString("base64");
    } catch (error) {
      return error;
    }
  };
  
  const keyDecrypt = (data) => {
    try {
      const folderPath = path.resolve(`${process.cwd()}/keys`);
      const privateKey = fs.readFileSync(`${folderPath}/private.pem`, "utf8");
  
      return privateDecrypt(
        {
          key: privateKey,
        },
        Buffer.from(data, "base64")
      ).toString();
    } catch (error) {
      return error;
    }
  };
  
  const Encrypt = (plain) => {
    try {
      const iv = randomBytes(10);
      const salt = randomBytes(10);
      const key = pbkdf2Sync(EncryptionSecret, salt, 2145, 32, "sha512");
      const cipher = createCipheriv("aes-256-gcm", key, iv);
  
      const encrypted = Buffer.concat([
        cipher.update(plain, "utf8"),
        cipher.final(),
      ]);
  
      const tag = cipher.getAuthTag();
  
      return (
        salt.toString("hex") +
        "-" +
        iv.toString("hex") +
        "-" +
        tag.toString("hex") +
        "-" +
        encrypted.toString("hex")
      );
    } catch (error) {
      return { error: "An error occurred during encryption" };
    }
  };
  
  const Decrypt = (data) => {
    try {
      const parts = data.split("-");
  
      if (parts.length !== 4) {
        return null;
      }
  
      const salt = Buffer.from(parts[0], "hex");
      const iv = Buffer.from(parts[1], "hex");
      const tag = Buffer.from(parts[2], "hex");
      const text = parts[3];
  
      const key = pbkdf2Sync(EncryptionSecret, salt, 2145, 32, "sha512");
  
      let decipher = createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(tag, "hex");
  
      const decrypted =
        decipher.update(text, "hex", "utf8") + decipher.final("utf8");
  
      return decrypted;
    } catch (error) {
      return { error: "An error occurred during decryption" };
    }
  };
  
  module.exports = {
    EncryptText,
    DecryptText,
    keyEncrypt,
    keyDecrypt,
    Encrypt,
    Decrypt,
  };
  