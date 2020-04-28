const jwt = require("jsonwebtoken");
const SEED = require("../config/variables").SEED;

// ====================================
// verifica token
// ====================================
exports.validar_token = (req, res, next) => {
  const token = req.query.token;
  jwt.verify(token, SEED, (err, userDecoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: "token no valido",
        errors: err,
      });
    }

    req.usuario = userDecoded.usuario;
    next();

    //si el token es valido
  });
};
