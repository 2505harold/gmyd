import { Component, OnInit } from "@angular/core";
import { TutelaService } from "src/app/services/tutela/tutela.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-tutela",
  templateUrl: "./tutela.component.html",
})
export class TutelaComponent implements OnInit {
  dataPing: any = [];
  showloadCharVideo: boolean = true;

  constructor(
    private _tutelaService: TutelaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.obtenerPruebasPingTutelaVideo(
      "Video",
      this.inicializarFechas().desde,
      this.inicializarFechas().hasta
    );
  }

  inicializarFechas() {
    let actual = new Date();
    let siguiente = actual.setDate(actual.getDate() + 1); // fecha de mañana
    let hoy = actual.setDate(actual.getDate() - 1); //
    let inicio = this.datePipe.transform(hoy, "yyyy-MM-dd");
    let fin = this.datePipe.transform(siguiente, "yyyy-MM-dd");
    return { desde: inicio, hasta: fin };
  }

  obtenerPruebasPingTutelaVideo(tipo: string, desde: string, hasta: string) {
    this._tutelaService
      .obtenerPruebasPingTutela(tipo, desde, hasta)
      .subscribe((resp) => {
        this.dataPing = resp;
        this.showloadCharVideo = false;
      });
  }
}
