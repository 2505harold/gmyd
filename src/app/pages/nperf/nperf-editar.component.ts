import { Component, OnInit } from "@angular/core";
import { NperfMeter } from "src/app/models/nperf.meter.model";
import { NgForm } from "@angular/forms";
import { NperfService } from "src/app/services/service.index";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-nperf-editar",
  templateUrl: "./nperf-editar.component.html",
  styles: [],
})
export class NperfEditarComponent implements OnInit {
  metricas: NperfMeter = new NperfMeter();
  id: string;

  constructor(
    public _nperfService: NperfService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params["id"];
      if (this.id !== "nuevo") {
        this.cargarMetrica(this.id);
      }
    });
  }

  cargarMetrica(id: string) {
    this._nperfService.obtenerMetricaPorId(id).subscribe((resp) => {
      this.metricas = resp;
    });
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.id !== "nuevo") {
      this.metricas.usuario = localStorage.getItem("id");
      this._nperfService.actualizarMetricaPorId(this.metricas).subscribe();
    } else {
      form.value.usuario = localStorage.getItem("id");
      this._nperfService.guardarMetricas(form.value).subscribe();
      form.reset();
    }
  }
}
