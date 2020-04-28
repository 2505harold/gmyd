import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "src/app/config/global";
import { map } from "rxjs/operators";
import { Usuario } from "src/app/models/usuario.model";

@Injectable()
export class UsuarioService {
  id: string = "";
  constructor(public http: HttpClient) {
    this.leerStorage();
  }

  login(correo: string, password: string) {
    const url = URL_SERVICIOS + "/login";
    return this.http.post(url, { correo, password }).pipe(
      map((resp: any) => {
        this.cargarStorage(resp.usuario, resp.token);
        return true;
      })
    );
  }

  guardarUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + "/usuario";
    return this.http.post(url, usuario).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  leerStorage() {
    if (localStorage.getItem("id")) {
      this.id = localStorage.getItem("id");
    } else {
      this.id = "";
    }
  }

  cargarStorage(usuario, token) {
    localStorage.setItem("id", usuario._id);
    localStorage.setItem("nombre", usuario.nombre);
    localStorage.setItem("token", token);
    this.id = usuario._id;
  }

  estaLogeado() {
    return this.id.length > 5 ? true : false;
  }
}
