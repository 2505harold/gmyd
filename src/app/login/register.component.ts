import { Component, OnInit } from "@angular/core";
import { Usuario } from "../models/usuario.model";
import { NgForm } from "@angular/forms";
import { UsuarioService } from "../services/service.index";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./login.component.css"],
})
export class RegisterComponent implements OnInit {
  usuario: Usuario = new Usuario("", "", "", "", "", "", "", "", "");
  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {}

  registrarse(form: NgForm) {
    this._usuarioService.guardarUsuario(form.value).subscribe((resp) => {
      this.router.navigate(["/login"]);
    });
  }
}
