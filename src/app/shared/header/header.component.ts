import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "src/app/services/service.index";
import { Usuario } from "src/app/models/usuario.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  constructor(public _usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
  }
}
