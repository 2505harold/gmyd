import { Component, OnInit } from "@angular/core";
import { TutelaService } from "src/app/services/tutela/tutela.service";
import { DatePipe } from "@angular/common";

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

  constructor(
    private _tutelaService: TutelaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerPruebasPingTutelaVideo(
      "Video",
      this.inicializarFechas().hoy,
      this.inicializarFechas().mañana
    );
    this.cagarGraficosPingServerThrDownload(
      "throughput_server_download",
      this.inicializarFechas().ayer,
      this.inicializarFechas().mañana
    );
    this.cagarGraficosPingServerThrUpload(
      "throughput_server_upload",
      this.inicializarFechas().ayer,
      this.inicializarFechas().mañana
    );
    this.cagarGraficosPingServerVideo(
      "video",
      this.inicializarFechas().ayer,
      this.inicializarFechas().mañana
    );
  }

  inicializarFechas() {
    let actual = new Date();
    let mañana = this.datePipe.transform(
      actual.setDate(actual.getDate() + 1),
      "yyyy-MM-dd"
    );
    let hoy = this.datePipe.transform(
      actual.setDate(actual.getDate() - 1),
      "yyyy-MM-dd"
    );
    let ayer = this.datePipe.transform(
      actual.setDate(actual.getDate() - 1),
      "yyyy-MM-dd"
    );
    return { mañana, hoy, ayer };
  }

  obtenerPruebasPingTutelaVideo(tipo: string, desde: string, hasta: string) {
    this._tutelaService
      .obtenerPruebasPingTutela(tipo, desde, hasta)
      .subscribe((resp) => {
        this.dataPing = resp;
        this.showloadCharVideo = false;
      });
  }

  cagarGraficosPingServerThrDownload(
    tipo: string,
    desde: string,
    hasta: string
  ) {
    this._tutelaService
      .obtenerGraficoPing(tipo, desde, hasta)
      .subscribe((resp) => {
        this.datosPingServerThrDownload = resp.datos;
        this.showLoadServerThrDownload = false;
      });
  }

  cagarGraficosPingServerThrUpload(tipo: string, desde: string, hasta: string) {
    this._tutelaService
      .obtenerGraficoPing(tipo, desde, hasta)
      .subscribe((resp) => {
        this.datosPingServerThrUpload = resp.datos;
        this.showLoadServerThrUpload = false;
      });
  }

  cagarGraficosPingServerVideo(tipo: string, desde: string, hasta: string) {
    this._tutelaService
      .obtenerGraficoPing(tipo, desde, hasta)
      .subscribe((resp) => {
        this.datosPingServerVideo = resp.datos;
        this.showLoadServerVideo = false;
      });
  }
}
