import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "src/app/config/global";
import { map } from "rxjs/operators";
import { Usuario } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable()
export class UsuarioService {
  id: string = "";
  usuario: any = [];
  token: string;
  constructor(public http: HttpClient, private router: Router) {
    this.leerStorage();
  }

  login(correo: string, password: string) {
    const url = URL_SERVICIOS + "/login";
    return this.http.post(url, { correo, password }).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.usuario, resp.token);
        return true;
      })
    );
  }

  logout() {
    this.id = "";
    this.usuario = [];
    this.token = "";
    localStorage.removeItem("id");
    localStorage.removeItem("usuario");
    localStorage.removeItem("nombre");
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
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
    if (localStorage.getItem("usuario")) {
      this.id = localStorage.getItem("id");
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.token = localStorage.getItem("token");
    } else {
      this.id = "";
      this.usuario = [];
      this.token = "";
    }
  }

  guardarStorage(usuario, token) {
    localStorage.setItem("id", usuario._id);
    localStorage.setItem("nombre", usuario.nombre);
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    this.usuario = usuario;
    this.id = usuario._id;
    this.token = token;
  }

  estaLogeado() {
    return this.usuario.nombre && this.usuario.role ? true : false;
  }

  obtenerDepartamentos() {
    let url = URL_SERVICIOS + "/usuario/departamentos";
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.departamentos;
      })
    );
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + "/usuario/" + usuario._id;
    return this.http.put(url, usuario).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          showConfirmButton: false,
          timer: 1500,
        });
      })
    );
  }

  obtenerUsuarios() {
    let url = URL_SERVICIOS + "/usuario";
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.usuarios;
      })
    );
  }
}
