import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UsuarioService } from "../services/service.index";

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  canActivate() {
    if (this._usuarioService.estaLogeado()) {
      console.log("guard : ", this._usuarioService.estaLogeado());
      this.router.navigate(["/nperf"]);
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
