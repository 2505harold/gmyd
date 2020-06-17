import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "src/app/services/service.index";
import { Usuario } from "src/app/models/usuario.model";

@Component({
  selector: "app-mant-usuarios",
  templateUrl: "./mant-usuarios.component.html",
})
export class MantUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  rolUsuario: string;

  constructor(private _usuarioService: UsuarioService) {}

  ngOnInit() {
    const usuario = this._usuarioService.usuario;
    this.rolUsuario = usuario.rol;
    this.cargarTablaUsuarios();
  }

  actualizarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe();
  }

  cargarTablaUsuarios() {
    this._usuarioService.obtenerUsuarios().subscribe((resp) => {
      this.usuarios = resp;
      console.log(this.usuarios);
    });
  }
}
