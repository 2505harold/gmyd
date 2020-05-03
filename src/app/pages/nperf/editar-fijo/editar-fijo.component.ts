import { Component, OnInit } from "@angular/core";
import { NperfFijoNacional } from "src/app/models/nperf.fijo.nacional";
import { NperfFijoLocal } from "src/app/models/nperf.fijo.local";
import { NperfService } from "src/app/services/service.index";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-editar-fijo",
  templateUrl: "./editar-fijo.component.html",
  styleUrls: [],
})
export class EditarFijoComponent implements OnInit {
  fijoNacional: NperfFijoNacional = new NperfFijoNacional();
  fijoLocal: NperfFijoLocal = new NperfFijoLocal();

  constructor(private _nperfService: NperfService) {}

  ngOnInit() {}

  guardar(form: NgForm) {
    let datos = {};
    this.fijoLocal.fecha_ingreso = new Date();
    this.fijoNacional.fecha_ingreso = new Date();
    this.fijoLocal.usuario = localStorage.getItem("id");
    this.fijoNacional.usuario = localStorage.getItem("id");
    datos = { nacional: this.fijoNacional, local: this.fijoLocal };
    this._nperfService.guardarMetricasNperfFijo(datos).subscribe((resp:any) => {
      if (resp.ok) form.reset();
    });
  }
}