import {
  Component,
  OnInit,
  ɵbypassSanitizationTrustStyle,
} from "@angular/core";
import { TutelaService } from "src/app/services/tutela/tutela.service";
import { FechaLocalService } from "src/app/services/fechas/fecha-local.service";
import { ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { stringify } from "@angular/compiler/src/util";

@Component({
  selector: "app-tutela",
  templateUrl: "./tutela.component.html",
})
export class TutelaComponent implements OnInit {
  title = "My first AGM project";
  lat = 51.678418;
  lng = 7.809007;

  myControl = new FormControl();

  checkedClaro: boolean = true;
  checkedTdp: boolean = true;

  datosPingFiltro: any[];

  checkServidor: any[] = [];
  checkAdminArea: any[] = [];
  checkSubAdminArea: any[] = [];
  checkLocalidad: any[] = [];
  checkTecnologia: any[] = [];
  checkOperador: any[] = [];

  datosPing: any[];
  showLoadPing: boolean = true;
  datosGraficaPingFiltro: any[];
  showLoadGraficaPingFiltro: boolean = true;
  datosDistrito: any[];
  showLoadDistritosPing: boolean = true;
  datosTopSites: any[];
  showLoadTopSites: boolean = true;
  datosHistoricoReporteSem: any[];
  showLoadHistoricoSem: boolean = true;
  view: string;

  urlsTutela: any[];

  cellids: any[];
  provincias: any[];
  provincias2: any[];
  departamentos: any[];
  localidades: any[];
  tecnologias: any[];
  operadores: any[];
  filteredOptions: Observable<string[]>;

  selectDep: string;
  selectProv: string;
  selectSubRegionTopSites: string;

  servidor: string[];
  regiones: string[] = ["NORTE", "CENTRO", "SUR", "LIMA"];
  subregiones: string[] = [
    "NORTE",
    "CENTRO",
    "SUR",
    "LIMA NORTE",
    "LIMA SUR",
    "LIMA ESTE",
    "LIMA OESTE",
  ];

  constructor(
    private _tutelaService: TutelaService,
    private _fechaService: FechaLocalService,
    private activeRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.selectDep = "Municipalidad Metropolitana de Lima";
    this.selectProv = "Provincia de Lima";
    this.selectSubRegionTopSites = "LIMA NORTE";

    this.activeRouter.params.subscribe((param) => {
      this.view = param["tipo"];
      this.cargarGraficoGeneral(
        this._fechaService.corta(-30, "yyyy-MM-dd"),
        this._fechaService.cortaSig("yyyy-MM-dd")
      );
      this.graficarDistritos(
        this.selectDep,
        this.selectProv,
        this._fechaService.corta(-7, "yyyy-MM-dd"),
        this._fechaService.cortaSig("yyyy-MM-dd")
      );
      this.graficarLatenciaSites(
        this.selectSubRegionTopSites,
        this._fechaService.corta(-30, "yyyy-MM-dd"),
        this._fechaService.cortaSig("yyyy-MM-dd")
      );
      this.graficarTopSites("grafico", this.selectSubRegionTopSites, 5);
      this.cargarUrlIpsTutela();
      this.cargarProvincias2(this.selectDep);
      this.cargarDepartamentos();
      this.cargarLocalidades();
      this.cargarTecnologias();
      this.cargarCellIds();
      this.cargarOperadores();
    });
  }

  filter(value: string): string[] {
    return this.cellids
      .map((x) => x.cellid)
      .filter((option) => option.toString().indexOf(value) == 0);
  }

  cargarUrlIpsTutela() {
    this._tutelaService.obtenerIpsTutela().subscribe((resp) => {
      this.urlsTutela = resp;
    });
  }

  cargarProvincias(dep: string) {
    this._tutelaService
      .obtenerTipoZonaTestPing("provincia", dep)
      .subscribe((resp) => {
        this.provincias = resp;
      });
  }

  cargarDepartamentos() {
    this._tutelaService
      .obtenerTipoZonaTestPing("departamento")
      .subscribe((resp) => {
        this.departamentos = resp;
      });
  }

  cargarOperadores() {
    this._tutelaService.obtenerOperadoresMovilPing().subscribe((resp) => {
      this.operadores = resp;
    });
  }

  cargarLocalidades() {
    this._tutelaService
      .obtenerTipoZonaTestPing("localidad")
      .subscribe((resp) => {
        this.localidades = resp;
      });
  }

  cargarCellIds() {
    this._tutelaService.obtenerCellIdPing().subscribe((resp) => {
      this.cellids = resp;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map((val) => this.filter(val))
      );
    });
  }

  cargarTecnologias() {
    this._tutelaService.obtenerTipoRedMovilPing().subscribe((resp) => {
      this.tecnologias = resp;
    });
  }

  servidorChange(event) {
    this.checkServidor = [];
    event.value.forEach((element) => {
      this.checkServidor.push({ namehost: element });
    });
  }

  provinciaChange(event) {
    this.checkSubAdminArea = [];
    event.value.forEach((element) => {
      this.checkSubAdminArea.push({ subAdminArea: element });
    });
  }

  localidadChange(event) {
    this.checkLocalidad = [];
    event.value.forEach((element) => {
      this.checkLocalidad.push({ locality: element });
    });
  }

  tecnologiaChange(event) {
    this.checkTecnologia = [];
    event.value.forEach((element) => {
      this.checkTecnologia.push({ networkType: element });
    });
  }

  operadorChange(event) {
    this.checkOperador = [];
    event.value.forEach((element) => {
      this.checkOperador.push({ operador: element });
    });
  }

  /***************************
   * METODOS CAMBIO Y CARGA DATOS SELECT
   ****************************/
  // Select de grafico de distritos
  onChangeDep(event) {
    this.cargarProvincias2(event.value);
  }
  onChangeProv(event) {
    this.graficarDistritos(
      this.selectDep,
      event.value,
      this._fechaService.corta(-7, "yyyy-MM-dd"),
      this._fechaService.cortaSig("yyyy-MM-dd")
    );
  }

  cargarProvincias2(dep: string) {
    this._tutelaService
      .obtenerTipoZonaTestPing("provincia", dep)
      .subscribe((resp) => {
        this.provincias2 = resp;
      });
  }

  // Select de grafico TOP Sites
  subregionesChange() {
    this.graficarTopSites("grafico", this.selectSubRegionTopSites, 5);
    this.graficarLatenciaSites(
      this.selectSubRegionTopSites,
      this._fechaService.corta(-30, "yyyy-MM-dd"),
      this._fechaService.cortaSig("yyyy-MM-dd")
    );
  }

  /***************************
   * METODOS DE GRAFICOS
   ****************************/
  cargarGraficoGeneral(desde: string, hasta: string) {
    this.showLoadPing = true;
    this._tutelaService
      .obtenerGraficoDiarioPing(desde, hasta)
      .subscribe((resp) => {
        this.datosPing = resp.data;
        this.showLoadPing = false;
      });
  }
  graficar() {
    this.datosPingFiltro = [];
    this.showLoadGraficaPingFiltro = true;
    const desde = this._fechaService.corta(-30, "yyyy-MM-dd");
    const hasta = this._fechaService.cortaSig("yyyy-MM-dd");
    const cellid = this.myControl.value;
    if (this.checkServidor.length > 0)
      this.checkServidor.forEach((item) => this.datosPingFiltro.push(item));
    if (this.checkSubAdminArea.length > 0)
      this.checkSubAdminArea.forEach((item) => this.datosPingFiltro.push(item));
    if (this.checkLocalidad.length > 0)
      this.checkLocalidad.forEach((item) => this.datosPingFiltro.push(item));
    if (this.checkTecnologia.length > 0)
      this.checkTecnologia.forEach((item) => this.datosPingFiltro.push(item));
    if (this.checkOperador.length > 0)
      this.checkOperador.forEach((item) => this.datosPingFiltro.push(item));

    if (cellid != null && cellid != "") this.datosPingFiltro.push({ cellid });

    this._tutelaService
      .obtenerGraficosFiltrosPing(desde, hasta, this.datosPingFiltro)
      .subscribe((resp) => {
        this.datosGraficaPingFiltro = resp;
        this.showLoadGraficaPingFiltro = false;
      });
  }
  graficarDistritos(dep: string, prov: string, desde: string, hasta: string) {
    this.showLoadDistritosPing = true;
    this._tutelaService
      .obtenerLatenciaxDistrito(dep, prov, desde, hasta)
      .subscribe((resp) => {
        this.datosDistrito = resp;
        this.showLoadDistritosPing = false;
      });
  }
  graficarTopSites(tipo: string, subregion?: string, top?: number) {
    this.showLoadTopSites = true;
    this._tutelaService
      .obtenerFotoLatenciaSite(tipo, subregion, top)
      .subscribe((resp) => {
        this.datosTopSites = resp;
        this.showLoadTopSites = false;
      });
  }
  graficarLatenciaSites(subregion: string, desde: string, hasta: string) {
    this.showLoadHistoricoSem = true;
    this._tutelaService
      .obtenerHistoricoLatenciaSite("grafico", desde, hasta, subregion)
      .subscribe((resp) => {
        this.datosHistoricoReporteSem = resp;
        this.showLoadHistoricoSem = false;
      });
  }
}
