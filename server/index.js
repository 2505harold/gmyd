const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("./config/variables.entorno");
const app = express();
//definir las rutas
const ipsAmazonRoutes = require("./routes/amazon");
const nperfRoutes = require("./routes/nperf");
const locationRoutes = require("./routes/location");
const usuarioRoutes = require("./routes/usuario");

//CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,GET");
  next();
});

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//rutas
app.use("/amazon", ipsAmazonRoutes);
app.use("/nperf", nperfRoutes);
app.use("/locacion", locationRoutes);
app.use("/usuario", usuarioRoutes);

//conexion a la base de datos
mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err, resp) => {
    if (err) throw err;
    console.log("database conectado");
  }
);

//configuracion al subir a heroku
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
    console.log(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(process.env.PORT, () => {
  console.log("server start");
});
