import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { UsuarioService } from "../services/service.index";
import Swal from "sweetalert2";

//declare function init_plugins();

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  correo: string;
  constructor(public router: Router, private _usuarioService: UsuarioService) {}

  ngOnInit() {
    //init_plugins();
  }

  ingresar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this._usuarioService
      .login(form.value.correo, form.value.password)
      .subscribe(
        (resp: any) => {
          this.router.navigate(["/nperf/movil"]);
        },
        (error) => {
          console.log(error);
          Swal.fire({
            icon: "warning",
            title: "Upss ocurrio un problema",
            text: error.error.mensaje,
          });
        }
      );
  }
}
