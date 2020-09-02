import { Component, OnInit } from "@angular/core";
import { TutelaService } from "src/app/services/tutela/tutela.service";
import { FechaLocalService } from "src/app/services/fechas/fecha-local.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-tutela",
  templateUrl: "./tutela.component.html",
})
export class TutelaComponent implements OnInit {
  datosPing: any[];
  showLoadPing: boolean = true;
  view: string;

  constructor(
    private _tutelaService: TutelaService,
    private _fechaService: FechaLocalService,
    private activeRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activeRouter.params.subscribe((param) => {
      this.view = param["tipo"];
      this.cargarGraficoAgrupadoPing(
        this._fechaService.corta(-15),
        this._fechaService.cortaSig()
      );
    });
  }

  cargarGraficoAgrupadoPing(desde: string, hasta: string) {
    this._tutelaService
      .obtenerGraficoAgrupadoPing(desde, hasta)
      .subscribe((resp) => {
        this.datosPing = resp.datos;
        this.showLoadPing = false;
      });
  }
}
