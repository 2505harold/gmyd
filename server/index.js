const express = require("express");
const path = require("path");
const app = express();

//inicializacion
app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(app.get("port"), () => {
  console.log("server start");
});
