const RegionesAmazon = require("../models/region-amazon");
const AppSiteTutela = require("../models/tutela/reporte.sites");
const AppFotoSiteTutela = require("../models/tutela/reporte.sites.photo");
const AppSiteOpensignal = require("../models/opensignal/reporte.sites");
const AppFotoSiteOpensignal = require("../models/opensignal/reporte.sites.photo");

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
  saveReportWeekDelaySiteTutela(data) {
    return new Promise((resolve, reject) => {
      AppSiteTutela.insertMany(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ ok: true });
        }
      });
    });
  },
  saveFotoReportWeekDelaySiteTutela(data) {
    return new Promise(async (resolve, reject) => {
      await AppFotoSiteTutela.deleteMany({});
      AppFotoSiteTutela.insertMany(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ ok: true });
        }
      });
    });
  },
  saveReportWeekDelaySitesOpensignal(data) {
    return new Promise((resolve, reject) => {
      AppSiteOpensignal.insertMany(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ ok: true });
        }
      });
    });
  },
  saveFotoReportWeekDelaySiteOpensignal(data) {
    return new Promise(async (resolve, reject) => {
      await AppFotoSiteOpensignal.deleteMany({});
      AppFotoSiteOpensignal.insertMany(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ ok: true });
        }
      });
    });
  },
};
