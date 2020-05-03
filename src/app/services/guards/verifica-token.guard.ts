import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { UsuarioService } from "../usuario/usuario.service";

@Injectable({
  providedIn: "root",
})
export class VerificaTokenGuard implements CanActivate {
  constructor(private _usuarioService: UsuarioService, private route: Router) {}
  canActivate() {
    console.log("guard verifica token");
    let token = this._usuarioService.token;
    let payload = JSON.parse(atob(token.split(".")[1]));

    console.log(payload);
    return true;
  }

  expirado(fecha_expiracion) {
    let ahora = new Date().getTime();
  }
}
