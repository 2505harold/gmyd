import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NperfService } from "src/app/services/service.index";

@Component({
  selector: "app-nperf",
  templateUrl: "./nperf.component.html",
  styles: [],
})
export class NperfComponent implements OnInit {
  puntajes: any = [];
  puntaje: any = [];
  progressVelocidades: any = [];
  velocidades: any = [];
  labels: any;
  loadTablaPuntos: boolean = true;
  totalRegistro: number = 0;
  desde: number = 0;
  loadTablaVelocidades: boolean = true;
  totalRegistro2: number = 0;
  desde2: number = 0;
  operadores = ["claro", "entel", "movistar", "bitel"];

  datos = [];
  datosVelocidades = [];

  constructor(private _nperfService: NperfService) {}

  ngOnInit() {
    this.loadDatosChart();
    this.loadDatosTables();
    this.loadDatosTablesVelocidades();
    this.loadUltimosPuntajes();
    this.loadDatosChartVelocidades();
    this.loadUltimasVelocidades();
  }

  loadUltimosPuntajes() {
    this._nperfService
      .obtenerSorterMetricas("fecha_ingreso", "desc", 0, 1)
      .subscribe((resp: any) => {
        let mayor = 0;
        this.operadores.forEach((operador) => {
          if (mayor < Number(resp.metricas[0][operador])) {
            mayor = Number(resp.metricas[0][operador]);
          }
        });

        this.operadores.forEach((operador) => {
          this.puntaje.push({
            operador,
            puntos: resp.metricas[0][operador],
            porcentaje: (resp.metricas[0][operador] / mayor) * 100,
          });
        });
      });
  }

  loadUltimasVelocidades() {
    this._nperfService
      .obtenerSorterMetricasVelocidades("fecha_ingreso", "desc", 0, 1)
      .subscribe((resp: any) => {
        let mayor = 0;
        this.operadores.forEach((operador) => {
          if (mayor < Number(resp.metricas[0][operador])) {
            mayor = Number(resp.metricas[0][operador]);
          }
        });

        this.operadores.forEach((operador) => {
          this.progressVelocidades.push({
            operador,
            puntos: resp.metricas[0][operador],
            porcentaje: (resp.metricas[0][operador] / mayor) * 100,
          });
        });
      });
  }

  loadDatosChart() {
    this._nperfService.obtenerMetricas().subscribe((resp: any) => {
      var datos = [];
      this.operadores.forEach((operador) => {
        var series = [];
        resp.metricas.forEach((objeto) => {
          series.push({
            name: new Date(objeto.fecha_ingreso),
            value: objeto[operador],
          });
        });
        datos.push({ name: operador, series: series });
      });

      this.datos = datos;
    });
  }

  loadDatosChartVelocidades() {
    this._nperfService.obtenerMetricasVelocidadMovil().subscribe((resp) => {
      this.datosVelocidades = resp;
    });
  }

  loadDatosTables(desde?: number) {
    this.loadTablaPuntos = true;
    this._nperfService
      .obtenerSorterMetricas("fecha_ingreso", "desc", desde)
      .subscribe((resp: any) => {
        this.puntajes = resp.metricas;
        this.totalRegistro = resp.total;
        this.loadTablaPuntos = false;
      });
  }

  loadDatosTablesVelocidades(desde?: number) {
    this.loadTablaPuntos = true;
    this._nperfService
      .obtenerSorterMetricasVelocidades("fecha_ingreso", "desc", desde)
      .subscribe((resp: any) => {
        this.velocidades = resp.metricas;
        this.totalRegistro2 = resp.total;
        this.loadTablaVelocidades = false;
      });
  }

  //click en siguiente o anterior en la tabla
  continuar(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistro) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.loadDatosTables(desde);
  }

  //click en siguiente o anterior en la tabla
  continuarT2(valor: number) {
    const desde2 = this.desde2 + valor;
    if (desde2 >= this.totalRegistro2) {
      return;
    }
    if (desde2 < 0) {
      return;
    }

    this.desde2 += valor;
    this.loadDatosTablesVelocidades(desde2);
  }
}
