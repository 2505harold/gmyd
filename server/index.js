const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("./config/variables.entorno");
const app = express();
//definir las rutas
const ipsAmazonRoutes = require("./routes/amazon");
const nperfRoutes = require("./routes/nperf");
const ipsTutelaRoutes = require("./routes/tutela");
const opensignalRoutes = require("./routes/opensignal");
const locationRoutes = require("./routes/location");
const usuarioRoutes = require("./routes/usuario");
const loginRoutes = require("./routes/login");
const internacionalRoutes = require("./routes/internacional");
const pingRoutes = require("./routes/ping");
const pingApp = require("./routes/pingapp");

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
app.use("/tutela", ipsTutelaRoutes);
app.use("/opensignal", opensignalRoutes);
app.use("/nperf", nperfRoutes);
app.use("/locacion", locationRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/internacional", internacionalRoutes);
app.use("/ping", pingRoutes);
app.use("/apping", pingApp);

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
  console.log("server start on port", process.env.PORT);
});
