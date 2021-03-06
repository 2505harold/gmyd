import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { NperfService, UsuarioService } from "src/app/services/service.index";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

//declare function init_plugins();

@Component({
  selector: "app-nperf",
  templateUrl: "./nperf.component.html",
  styles: [],
})
export class NperfComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  puntaje: any = [];
  progressVelocidades: any = [];
  labels: any;
  loadTablaPuntos: boolean = true;
  totalRegistro: number = 0;
  desde: number = 0;
  loadTablaVelocidades: boolean = true;
  totalRegistro2: number = 0;
  desde2: number = 0;
  operadores = ["bitel", "claro", "entel", "movistar"];

  //valriables de angular material tables
  columnsTblPuntajeNacional: string[] = [
    "index",
    "fecha",
    "usuario",
    "claro",
    "entel",
    "bitel",
    "movistar",
    "acciones",
  ];
  datosTblPuntajeNacional = new MatTableDataSource();
  columnsTblMovilNacional: string[] = [
    "index",
    "fecha",
    "usuario",
    "claro",
    "entel",
    "bitel",
    "movistar",
    "acciones",
  ];
  datosTblMovilNacional = new MatTableDataSource();

  datos = [];
  datosVelocidades = [];

  constructor(
    private _nperfService: NperfService,
    public _usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    //grafico de historico puntaje nacional movil
    this.loadDatosChart();
    //grafico de historico velocidad nacional movil
    this.loadDatosChartVelocidades();
    //Tabla de usuarios ingresaron datos puntaje nacional movil
    this.loadDatosTables();
    //Tabla de usuarios ingresaron datos velocidad nacional movil
    this.loadDatosTablesVelocidades();
    //progress bar de puntaje nacional movil
    this.loadUltimosPuntajes();
    //progress bar de puntaje velocidad nacional movil
    this.loadUltimasVelocidades();
  }

  /************************** */
  /** Metodos de progressbar */
  /*************************** */

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

  /************************** */
  /** Metodos carga de charts */
  /*************************** */

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

  /************************** */
  /** Metodos de carga de tablas */
  /*************************** */

  loadDatosTables(desde?: number) {
    this.loadTablaPuntos = true;
    this._nperfService
      .obtenerSorterMetricas("fecha_ingreso", "desc", desde)
      .subscribe((resp: any) => {
        this.datosTblPuntajeNacional = resp.metricas;
        this.datosTblPuntajeNacional.paginator = this.paginator;
        this.totalRegistro = resp.total;
        this.loadTablaPuntos = false;
      });
  }

  loadDatosTablesVelocidades(desde?: number) {
    this.loadTablaVelocidades = true;
    this._nperfService
      .obtenerSorterMetricasVelocidades("fecha_ingreso", "desc", desde)
      .subscribe((resp: any) => {
        this.datosTblMovilNacional = resp.metricas;
        this.datosTblMovilNacional.paginator = this.paginator;
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
