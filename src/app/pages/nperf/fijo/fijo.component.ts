import { Component, OnInit } from "@angular/core";
import { NperfService, UsuarioService } from "src/app/services/service.index";
import { MatTableDataSource } from "@angular/material/table";

//declare function init_plugins();

@Component({
  selector: "app-fijo",
  templateUrl: "./fijo.component.html",
  styleUrls: [],
})
export class FijoComponent implements OnInit {
  nacional: any = [];
  totalRegistroNacional: number;
  totalRegistroLocal: number;
  desde: number = 0;
  desde2: number = 0;
  progressNacional: any = [];
  local: any = [];
  progressLocal: any = [];
  departamentos: any = [];
  distUser: string;
  idUser: string;
  campos_nacionales = ["claro", "americatel_peru", "movistar", "winet_telecom"];
  campos_locales = ["claro", "americatel_peru", "movistar", "winet_telecom"];
  loadTablaFijoNacional: boolean;
  loadTablaFijoLocal: boolean;

  //valriables de angular material tables
  columnsTblFijoNacional: string[] = [
    "index",
    "fecha",
    "usuario",
    "claro",
    "americatel",
    "movistar",
    "acciones",
  ];
  datosTblFijoNacional = new MatTableDataSource();
  columnsTblFijoLocal: string[] = [
    "index",
    "fecha",
    "usuario",
    "claro",
    "movistar",
    "americatel",
    "winet",
    "acciones",
  ];
  datosTblFijoLocal = new MatTableDataSource();

  constructor(
    private _nperfService: NperfService,
    public _usuarioService: UsuarioService
  ) {
    this.distUser = JSON.parse(localStorage.getItem("usuario")).distrito;
    this.idUser = localStorage.getItem("id");
  }

  ngOnInit() {
    //init_plugins();
    this.loadDatosChartNacional();
    this.loadDatosChartLocal(this.idUser);
    //progressbar datos fijo nacional
    this.loadUltimosDatosNacional();
    //progressbar datos fijo local
    this.loadUltimosDatosLocal();
    //datos de tabla fijo nacional
    this.loadDatosTablaFijoNacional();
    //datos de tabla fijo local
    this.loadDatosTablaFijoLocal();
  }

  loadDatosChartNacional() {
    this._nperfService.obtenerMetricasFijoNacional().subscribe((resp: any) => {
      var datos = [];
      this.campos_nacionales.forEach((operador) => {
        var series = [];
        resp.metricas.forEach((objeto) => {
          if (objeto[operador]) {
            series.push({
              name: new Date(objeto.fecha_ingreso),
              value: objeto[operador],
            });
          }
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
        //this.nacionalTabla = resp.metricas;
        this.datosTblFijoNacional = resp.metricas;
        this.totalRegistroNacional = resp.total;
        this.loadTablaFijoNacional = false;
      });
  }

  loadDatosTablaFijoLocal(desde?: number) {
    this.loadTablaFijoLocal = true;
    this._nperfService
      .obtenerSorterMetricasFijoLocal("fecha_ingreso", "desc", desde)
      .subscribe((resp: any) => {
        //this.localTabla = resp.metricas;
        this.datosTblFijoLocal = resp.metricas;
        this.totalRegistroLocal = resp.total;
        this.loadTablaFijoLocal = false;
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

  continuarT2(valor: number) {
    const desde = this.desde2 + valor;
    if (desde >= this.totalRegistroLocal) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde2 += valor;
    this.loadDatosTablaFijoLocal(desde);
  }
}
