const express = require("express");
const publicIp = require("public-ip");
//const ipLocation = require("iplocation"); //desinstalar
//const ip2loc = require("ip2location-nodejs");
const path = require("path");

const app = express();

//console.log(path.join(__dirname, "../iplocation/IP2LOCATION-LITE-DB1.BIN"));

// ====================================
// Obtener mi locacion por mi ip publica
// ====================================
app.get("/", (req, res) => {
  //   const location = (async () => {
  //     return await ipLocation("190.113.209.21");
  //     //=> { latitude: -33.8591, longitude: 151.2002, region: { name: "New South Wales" ... } ... }
  //   })();
  ip2loc.IP2Location_init(
    path.join(__dirname, "../iplocation/IP2LOCATION-LITE-DB1.BIN")
  );
  result = ip2loc.IP2Location_get_all("190.113.209.21");
  console.log(result);
});

module.exports = app;
