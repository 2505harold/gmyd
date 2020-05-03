import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UsuarioService } from "../usuario/usuario.service";

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  canActivate() {
    if (this._usuarioService.estaLogeado()) {
      console.log("guard : ", this._usuarioService.estaLogeado());
      return true;
    } else {
      console.log("guard no deja pasar");
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
