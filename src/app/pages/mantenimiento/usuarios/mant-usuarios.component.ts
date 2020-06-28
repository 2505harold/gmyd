import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "src/app/services/service.index";
import { Usuario } from "src/app/models/usuario.model";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-mant-usuarios",
  templateUrl: "./mant-usuarios.component.html",
})
export class MantUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  rolUsuario: string;
  loadTblUsuarios: boolean = true;
  //variables de tabla angular material
  dataTblUsuarios = new MatTableDataSource();
  columns: string[] = [
    "No.",
    "usuario",
    "role",
    "correo",
    "departamento",
    "provincia",
    "distrito",
    "acciones",
  ];

  constructor(public _usuarioService: UsuarioService) {}

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
      //this.usuarios = resp;
      this.dataTblUsuarios = resp;
      this.loadTblUsuarios = false;
    });
  }
}
