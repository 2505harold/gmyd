// ====================================
// PORT SERVER
// ====================================
process.env.PORT = process.env.PORT || 3005;

// ====================================
// ENTORNO
// ====================================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ====================================
// BASE DE DATOS
// ====================================
let urlDB;
if (process.env.NODE_ENV.toString() === "dev") {
  urlDB = "mongodb://localhost/gmyd";
} else {
  //urlDB = process.env.MONGO_URI.toString();
  //URl para conexion a mongo DB Atlas
  urlDB = "mongodb+srv://dbclaro:Hgeminis2014+@claro-ep0fe.mongodb.net/claro";
}

process.env.URLDB = urlDB;
