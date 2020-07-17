const RegionesAmazon = require("../models/region-amazon");

module.exports = {
  getRegionsAmazon() {
    return new Promise((resolve, reject) => {
      RegionesAmazon.find({}).exec((err, regions) => {
        if (err) {
          reject(err);
        } else {
          resolve(regions);
        }
      });
    });
  },
};
