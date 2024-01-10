const fs = require("fs");
const path = require("path");

/**
 * Get package.json file from root directory
 * @returns {Promise}
 */
const getPackageJson = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join("package.json"), "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

/**
 * Beautify JSON
 * @param {JSON} json
 * @param {number} space
 * @returns {string}
 */
const jsonBeautify = (json, space = 2) => JSON.stringify(json, null, space);

module.exports = {
  getPackageJson,
  jsonBeautify,
};
