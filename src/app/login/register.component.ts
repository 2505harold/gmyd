import { Component, OnInit } from "@angular/core";
import { Usuario } from "../models/usuario.model";
import { NgForm } from "@angular/forms";
import { UsuarioService } from "../services/service.index";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./login.component.css"],
})
export class RegisterComponent implements OnInit {
  public clickRegister: boolean = false;
  passwordIguales: boolean = true;

  usuario: Usuario = new Usuario("", "", "", "", "", "", "", "", "");
  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {}

  registrarse(form: NgForm) {
    if (!this.passwordIguales) {
      return;
    }

    this.clickRegister = true;
    console.log("click");
    this._usuarioService.guardarUsuario(form.value).subscribe(
      (resp) => {
        this.router.navigate(["/login"]);
      },
      (err) => {
        const error = err.error;
        Swal.fire({
          icon: "error",
          title: error.mensaje,
          text: error.errors.message,
        });
        this.clickRegister = false;
      }
    );
  }

  confirmarPassword(pass1: string, pass2: string) {
    if (pass1 != pass2) {
      this.passwordIguales = false;
    } else {
      this.passwordIguales = true;
    }
  }
}
