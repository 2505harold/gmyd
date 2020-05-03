import { Component, OnInit } from "@angular/core";
import { NperfVelocidad } from "src/app/models/nperf.velocidad.model";
import { NperfService } from "src/app/services/service.index";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-testvelocidad",
  templateUrl: "./testvelocidad.component.html",
  styleUrls: [],
})
export class TestvelocidadComponent implements OnInit {
  metricas: NperfVelocidad = new NperfVelocidad();

  constructor(private _nperfService: NperfService) {}

  ngOnInit() {}

  guardar(form: NgForm) {
    this.metricas.tipo = "Movil";
    this.metricas.fecha_ingreso = new Date();
    this.metricas.usuario = localStorage.getItem("id");
    this._nperfService.guardarMetricasVelocidad(this.metricas).subscribe();
    form.reset();
  }
}
