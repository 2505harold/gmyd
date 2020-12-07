import { Component, OnInit } from "@angular/core";
import { OpensignalService } from "src/app/services/opensignal/opensignal.service";
import { FechaLocalService } from "src/app/services/fechas/fecha-local.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-opensignal",
  templateUrl: "./opensignal.component.html",
  styleUrls: ["./opensignal.component.css"],
})
export class OpensignalComponent implements OnInit {
  datosPing: any[];
  showLoadPing: boolean = true;
  colors: any[] = ["#dc3545", "#28a745"];
  view: string;
  src: string;

  constructor(
    private _opensignalService: OpensignalService,
    private _fechaLocalService: FechaLocalService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.view = params["id"];
      this.cargarGraficoAgrupadoPing(
        this._fechaLocalService.corta(-360),
        this._fechaLocalService.cortaSig()
      );
    });
  }

  cargarGraficoAgrupadoPing(desde: string, hasta: string) {
    this._opensignalService
      .obtenerGraficoAgrupadoPing(desde, hasta)
      .subscribe((resp) => {
        this.datosPing = resp.datos;
        this.showLoadPing = false;
      });
  }
}
