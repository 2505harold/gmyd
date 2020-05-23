import { Component, OnInit } from "@angular/core";
import { NperfFijoNacional } from "src/app/models/nperf.fijo.nacional";
import { NperfFijoLocal } from "src/app/models/nperf.fijo.local";
import { NperfService } from "src/app/services/service.index";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-editar-fijo",
  templateUrl: "./editar-fijo.component.html",
  styleUrls: [],
})
export class EditarFijoComponent implements OnInit {
  fijoNacional: NperfFijoNacional = new NperfFijoNacional();
  fijoLocal: NperfFijoLocal = new NperfFijoLocal();
  metrica: any = [];
  id: string;
  area: string;
  crear: boolean = true;

  constructor(
    private _nperfService: NperfService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      this.id = params["id"];
      this.area = params["area"];
      if (this.id !== "nuevo") {
        this.crear = false;
        this.cargarMetrica(this.id, this.area);
      }
    });
  }

  ngOnInit() {}

  cargarMetrica(id: string, area: string) {
    this._nperfService.obtenerMetricaFijoPorId(id, area).subscribe((resp) => {
      area === "nacional"
        ? (this.fijoNacional = resp)
        : (this.fijoLocal = resp);
    });
  }

  guardar(form: NgForm) {
    if (this.id !== "nuevo") {
      this.metrica =
        this.area === "nacional" ? this.fijoNacional : this.fijoLocal;
      this._nperfService
        .actualizarMetricaFijo(this.metrica, this.area)
        .subscribe();
    } else {
      let datos = {};
      this.fijoLocal.fecha_ingreso = new Date();
      this.fijoNacional.fecha_ingreso = new Date();
      this.fijoLocal.usuario = localStorage.getItem("id");
      this.fijoNacional.usuario = localStorage.getItem("id");
      datos = { nacional: this.fijoNacional, local: this.fijoLocal };
      this._nperfService
        .guardarMetricasNperfFijo(datos)
        .subscribe((resp: any) => {
          if (resp.ok) form.reset();
        });
    }
  }
}
