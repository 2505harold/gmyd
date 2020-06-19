import { Component, OnInit } from "@angular/core";
import { OpensignalService } from "src/app/services/opensignal/opensignal.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-opensignal",
  templateUrl: "./opensignal.component.html",
  styleUrls: ["./opensignal.component.css"],
})
export class OpensignalComponent implements OnInit {
  datosPingServer: any[];
  showLoadServer: boolean = true;
  colors: any[] = ["#dc3545", "#28a745"];

  constructor(
    private _opensignalService: OpensignalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.cagarGraficosPingServer(
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

  cagarGraficosPingServer(desde: string, hasta: string) {
    this._opensignalService
      .obtenerGraficoPing(desde, hasta)
      .subscribe((resp) => {
        this.datosPingServer = resp.datos;
        this.showLoadServer = false;
      });
  }
}
