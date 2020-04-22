import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "src/app/config/global";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Usuario } from "src/app/models/usuario.model";

@Injectable()
export class UsuarioService {
  id: string = "";
  constructor(public http: HttpClient) {
    this.leerStorage();
  }

  login(correo: string, password: string) {
    const url = URL_SERVICIOS + "/usuario/login";
    return this.http.post(url, { correo, password }).pipe(
      map((resp: any) => {
        this.cargarStorage(resp.usuario);
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

  cargarStorage(usuario) {
    localStorage.setItem("id", usuario._id);
    localStorage.setItem("nombre", usuario.nombre);
    this.id = usuario._id;
  }

  estaLogeado() {
    return this.id.length > 5 ? true : false;
  }
}
