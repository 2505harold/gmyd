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
  datosPingServer: any[];
  showLoadServer: boolean = true;
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
      this.cagarGraficosPingServer(
        this._fechaLocalService.corta(-6),
        this._fechaLocalService.cortaSig(),
        this.view
      );
    });
  }

  cagarGraficosPingServer(desde: string, hasta: string, tipo: string) {
    this._opensignalService
      .obtenerGraficoPing(desde, hasta, tipo)
      .subscribe((resp) => {
        console.log(resp.datos)
        this.datosPingServer = resp.datos;
        this.showLoadServer = false;
      });
  }
}
