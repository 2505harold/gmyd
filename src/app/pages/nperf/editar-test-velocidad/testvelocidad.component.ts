import { Component, OnInit } from "@angular/core";
import { NperfVelocidad } from "src/app/models/nperf.velocidad.model";
import { NperfService } from "src/app/services/service.index";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-testvelocidad",
  templateUrl: "./testvelocidad.component.html",
  styleUrls: [],
})
export class TestvelocidadComponent implements OnInit {
  metricas: NperfVelocidad = new NperfVelocidad();
  id: string;
  constructor(
    private _nperfService: NperfService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      this.id = params["id"];
      if (this.id !== "nuevo") {
        this.cargarVelocidad(this.id);
      }
    });
  }

  ngOnInit() {}

  cargarVelocidad(id: string) {
    this._nperfService
      .obtenerMetricasVelocidadMovilPorId(id)
      .subscribe((resp) => {
        this.metricas = resp;
      });
  }

  guardar(form: NgForm) {
    this.metricas.tipo = "Movil";
    if (this.id !== "nuevo") {
      this.metricas.usuario = localStorage.getItem("id");
      console.log(this.metricas);
      this._nperfService.actualizarMetricaVelocidad(this.metricas).subscribe();
    } else {
      this.metricas.fecha_ingreso = new Date();
      this.metricas.usuario = localStorage.getItem("id");
      this._nperfService.guardarMetricasVelocidad(this.metricas).subscribe();
      form.reset();
    }
  }
}
