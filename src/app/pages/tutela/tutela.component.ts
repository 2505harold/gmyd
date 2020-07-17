import { Component, OnInit } from "@angular/core";
import { TutelaService } from "src/app/services/tutela/tutela.service";
import { FechaLocalService } from "src/app/services/fechas/fecha-local.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-tutela",
  templateUrl: "./tutela.component.html",
})
export class TutelaComponent implements OnInit {
  dataPing: any = [];
  datosPingServerThrDownload: any[];
  datosPingServerThrUpload: any[];
  datosPingServerLatency: any[];
  datosPingServerVideo: any[];
  showloadCharVideo: boolean = true;
  showLoadServerThrDownload: boolean = true;
  showLoadServerThrUpload: boolean = true;
  showLoadServerVideo: boolean = true;
  view: string;

  constructor(
    private _tutelaService: TutelaService,
    private _fechaService: FechaLocalService,
    private activeRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activeRouter.params.subscribe((param) => {
      this.view = param["tipo"];
      this.obtenerPruebasPingTutelaVideo(
        this.view,
        "Video",
        this._fechaService.localCorta(),
        this._fechaService.cortaSig()
      );
      this.cagarGraficosPingServerThrDownload(
        this.view,
        "throughput_server_download",
        this._fechaService.corta(-6),
        this._fechaService.cortaSig()
      );
      this.cagarGraficosPingServerThrUpload(
        this.view,
        "throughput_server_upload",
        this._fechaService.corta(-6),
        this._fechaService.cortaSig()
      );
      this.cagarGraficosPingServerVideo(
        this.view,
        "video",
        this._fechaService.corta(-6),
        this._fechaService.cortaSig()
      );
    });
  }

  obtenerPruebasPingTutelaVideo(
    categoria: string,
    tipo: string,
    desde: string,
    hasta: string
  ) {
    this._tutelaService
      .obtenerPruebasPingTutela(categoria, tipo, desde, hasta)
      .subscribe((resp) => {
        this.dataPing = resp;
        this.showloadCharVideo = false;
      });
  }

  cagarGraficosPingServerThrDownload(
    categoria: string,
    tipo: string,
    desde: string,
    hasta: string
  ) {
    this._tutelaService
      .obtenerGraficoPing(categoria, tipo, desde, hasta)
      .subscribe((resp) => {
        this.datosPingServerThrDownload = resp.datos;
        this.showLoadServerThrDownload = false;
      });
  }

  cagarGraficosPingServerThrUpload(
    categoria: string,
    tipo: string,
    desde: string,
    hasta: string
  ) {
    this._tutelaService
      .obtenerGraficoPing(categoria, tipo, desde, hasta)
      .subscribe((resp) => {
        this.datosPingServerThrUpload = resp.datos;
        this.showLoadServerThrUpload = false;
      });
  }

  cagarGraficosPingServerVideo(
    categoria: string,
    tipo: string,
    desde: string,
    hasta: string
  ) {
    this._tutelaService
      .obtenerGraficoPing(categoria, tipo, desde, hasta)
      .subscribe((resp) => {
        this.datosPingServerVideo = resp.datos;
        this.showLoadServerVideo = false;
      });
  }
}
