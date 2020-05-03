import { Component, OnInit } from "@angular/core";
import { NperfFijoNacional } from "src/app/models/nperf.fijo.nacional";
import { NperfFijoLocal } from "src/app/models/nperf.fijo.local";
import { NperfService, UsuarioService } from "src/app/services/service.index";

@Component({
  selector: "app-fijo",
  templateUrl: "./fijo.component.html",
  styleUrls: [],
})
export class FijoComponent implements OnInit {
  nacional: any = [];
  nacionalTabla: any = [];
  totalRegistroNacional: any = [];
  desde: number;
  progressNacional: any = [];
  local: any = [];
  progressLocal: any = [];
  departamentos: any = [];
  distUser: string;
  idUser: string;
  campos_nacionales = ["claro", "americatel_peru", "movistar"];
  campos_locales = ["claro", "americatel_peru", "movistar", "winet_telecom"];
  loadTablaFijoNacional: boolean;

  constructor(private _nperfService: NperfService) {
    this.distUser = JSON.parse(localStorage.getItem("usuario")).distrito;
    this.idUser = localStorage.getItem("id");
  }

  ngOnInit() {
    this.loadDatosChartNacional();
    this.loadUltimosDatosNacional();
    this.loadDatosChartLocal(this.idUser);
    this.loadUltimosDatosLocal();
    this.loadDatosTablaFijoNacional();
  }

  loadDatosChartNacional() {
    this._nperfService.obtenerMetricasFijoNacional().subscribe((resp: any) => {
      var datos = [];
      this.campos_nacionales.forEach((operador) => {
        var series = [];
        resp.metricas.forEach((objeto) => {
          series.push({
            name: new Date(objeto.fecha_ingreso),
            value: objeto[operador],
          });
        });
        datos.push({ name: operador, series: series });
      });

      this.nacional = datos;
    });
  }

  loadUltimosDatosNacional() {
    this._nperfService
      .obtenerSorterMetricasFijoNacional("fecha_ingreso", "desc", 0, 1)
      .subscribe((resp: any) => {
        let mayor = 0;
        this.campos_nacionales.forEach((operador) => {
          if (mayor < Number(resp.metricas[0][operador])) {
            mayor = Number(resp.metricas[0][operador]);
          }
        });

        this.campos_nacionales.forEach((operador) => {
          this.progressNacional.push({
            operador,
            puntos: resp.metricas[0][operador],
            porcentaje: (resp.metricas[0][operador] / mayor) * 100,
          });
        });
      });
  }

  loadDatosChartLocal(id: string) {
    this._nperfService
      .obtenerMetricasFijoLocalxUsuario(id)
      .subscribe((resp: any) => {
        var datos = [];
        this.campos_locales.forEach((operador) => {
          var series = [];
          resp.metricas.forEach((objeto) => {
            series.push({
              name: new Date(objeto.fecha_ingreso),
              value: objeto[operador],
            });
          });
          datos.push({ name: operador, series: series });
        });

        this.local = datos;
      });
  }

  loadUltimosDatosLocal() {
    this._nperfService
      .obtenerSorterMetricasFijoLocal("fecha_ingreso", "desc", 0, 1)
      .subscribe((resp: any) => {
        let mayor = 0;
        this.campos_locales.forEach((operador) => {
          if (mayor < Number(resp.metricas[0][operador])) {
            mayor = Number(resp.metricas[0][operador]);
          }
        });

        this.campos_locales.forEach((operador) => {
          this.progressLocal.push({
            operador,
            puntos: resp.metricas[0][operador],
            porcentaje: (resp.metricas[0][operador] / mayor) * 100,
          });
        });
      });
  }

  loadDatosTablaFijoNacional(desde?: number) {
    this.loadTablaFijoNacional = true;
    this._nperfService
      .obtenerSorterMetricasFijoNacional("fecha_ingreso", "desc", desde)
      .subscribe((resp: any) => {
        this.nacionalTabla = resp.metricas;
        this.totalRegistroNacional = resp.total;
        this.loadTablaFijoNacional = false;
      });
  }

  //click en siguiente o anterior en la tabla
  continuar(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistroNacional) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.loadDatosTablaFijoNacional(desde);
  }
}
