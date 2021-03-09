import { Component, OnInit } from "@angular/core";
import { OpensignalService } from "src/app/services/opensignal/opensignal.service";
import { FechaLocalService } from "src/app/services/fechas/fecha-local.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-opensignal",
  templateUrl: "./opensignal.component.html",
  styleUrls: ["./opensignal.component.css"],
})
export class OpensignalComponent implements OnInit {
  myControl = new FormControl();
  desde: string;
  hasta: string;

  checkedClaro: boolean = true;
  checkedTdp: boolean = true;

  datosPingFiltro: any[];

  checkServidor: any[] = [];
  checkAdminArea: any[] = [];
  checkLocalidad: any[] = [];
  checkTecnologia: any[] = [];
  checkOperador: any[] = [];

  datosHostPing: any[];
  showLoadHostPing: boolean = true;
  datosPing: any[];
  showLoadPing: boolean = true;
  datosGraficaPingFiltro: any[];
  showLoadGraficaPingFiltro: boolean = true;
  datosDistrito: any[];
  showLoadDistritosPing: boolean = true;
  view: string;

  urls: any[];

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
  selectServer: string;
  selectServerHost: string = "todos";
  selectMetricaHost: string = "und";
  selectOperadorHost: string = "Claro";

  servidor: string[];

  constructor(
    private _opensignalService: OpensignalService,
    private _fechaService: FechaLocalService,
    private activeRouter: ActivatedRoute
  ) {
    this.desde = this._fechaService.corta(-60, "yyyy-MM-dd");
    this.hasta = this._fechaService.cortaSig("yyyy-MM-dd");
  }

  ngOnInit() {
    this.selectDep = "Municipalidad Metropolitana de Lima";
    this.selectProv = "Provincia de Lima";
    this.selectServer = "todos";
    this.activeRouter.params.subscribe((param) => {
      this.view = param["id"];
      this.cargarGraficoGeneral(this.desde, this.hasta, this.selectServer);
      this.cargarGraficoHost(
        this.desde,
        this.hasta,
        "Claro",
        this.selectServerHost,
        this.selectMetricaHost
      );
      this.cargarUrlIps();
      this.cargarProvincias();
      this.cargarProvincias2(this.selectDep);
      this.cargarDepartamentos();
      this.cargarLocalidades();
      this.cargarTecnologias();
      this.cargarCellIds();
      this.cargarOperadores();
      this.graficarDistritos(
        this.selectDep,
        this.selectProv,
        this._fechaService.corta(-7, "yyyy-MM-dd"),
        this._fechaService.cortaSig("yyyy-MM-dd")
      );
    });
  }

  cargarGraficoGeneral(desde: string, hasta: string, server: string) {
    this.showLoadPing = true;
    this._opensignalService
      .obtenerGraficoDiarioPing(desde, hasta, server)
      .subscribe((resp) => {
        this.datosPing = resp.data;
        this.showLoadPing = false;
      });
  }

  cargarGraficoHost(
    desde: string,
    hasta: string,
    operador: string,
    server: string,
    metrica: string
  ) {
    this.showLoadHostPing = true;
    this._opensignalService
      .obtenerHostPing(desde, hasta, operador, server, metrica)
      .subscribe((resp) => {
        this.datosHostPing = resp;
        this.showLoadHostPing = false;
      });
  }

  filter(value: string): string[] {
    return this.cellids
      .map((x) => x.cellid)
      .filter((option) => option.toString().indexOf(value) == 0);
  }

  cargarUrlIps() {
    this._opensignalService.obtenerServers().subscribe((resp) => {
      this.urls = resp;
    });
  }

  cargarProvincias() {
    this._opensignalService
      .obtenerTipoZonaTestPing("provincia")
      .subscribe((resp) => {
        this.provincias = resp;
      });
  }

  cargarLocalidades() {
    this._opensignalService
      .obtenerTipoZonaTestPing("localidad")
      .subscribe((resp) => {
        this.localidades = resp;
      });
  }

  cargarCellIds() {
    this._opensignalService.obtenerCellIdPing().subscribe((resp) => {
      this.cellids = resp;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map((val) => this.filter(val))
      );
    });
  }

  cargarTecnologias() {
    this._opensignalService.obtenerTipoRedMovilPing().subscribe((resp) => {
      this.tecnologias = resp;
    });
  }

  cargarOperadores() {
    this._opensignalService.obtenerOperadoresMovilPing().subscribe((resp) => {
      this.operadores = resp;
    });
  }
  cargarProvincias2(dep: string) {
    this._opensignalService
      .obtenerTipoZonaTestPing("provincia", dep)
      .subscribe((resp) => {
        this.provincias2 = resp;
      });
  }

  cargarDepartamentos() {
    this._opensignalService
      .obtenerTipoZonaTestPing("departamento")
      .subscribe((resp) => {
        this.departamentos = resp;
      });
  }

  servidorChange(event) {
    this.checkServidor = [];
    event.value.forEach((element) => {
      this.checkServidor.push({ namehost: element });
    });
  }

  provinciaChange(event) {
    this.checkAdminArea = [];
    event.value.forEach((element) => {
      this.checkAdminArea.push({ adminArea: element });
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

  onChangeServer(grafico: string) {
    //this.cargarProvincias2(event.value);
    switch (grafico) {
      case "general":
        this.cargarGraficoGeneral(this.desde, this.hasta, this.selectServer);
        break;
      case "host":
        this.cargarGraficoHost(
          this.desde,
          this.hasta,
          this.selectOperadorHost,
          this.selectServerHost,
          this.selectMetricaHost
        );
        break;
    }
  }

  onChangeMetrica() {
    this.cargarGraficoHost(
      this.desde,
      this.hasta,
      this.selectOperadorHost,
      this.selectServerHost,
      this.selectMetricaHost
    );
  }

  onChangeOperadorHost() {
    this.cargarGraficoHost(
      this.desde,
      this.hasta,
      this.selectOperadorHost,
      this.selectServerHost,
      this.selectMetricaHost
    );
  }

  operadorChange(event) {
    this.checkOperador = [];
    event.value.forEach((element) => {
      this.checkOperador.push({ operador: element });
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
    if (this.checkAdminArea.length > 0)
      this.checkAdminArea.forEach((item) => this.datosPingFiltro.push(item));
    if (this.checkLocalidad.length > 0)
      this.checkLocalidad.forEach((item) => this.datosPingFiltro.push(item));
    if (this.checkTecnologia.length > 0)
      this.checkTecnologia.forEach((item) => this.datosPingFiltro.push(item));
    if (this.checkOperador.length > 0)
      this.checkOperador.forEach((item) => this.datosPingFiltro.push(item));

    if (cellid != null && cellid != "") this.datosPingFiltro.push({ cellid });

    this._opensignalService
      .obtenerGraficosFiltrosPing(desde, hasta, this.datosPingFiltro)
      .subscribe((resp) => {
        this.datosGraficaPingFiltro = resp;
        this.showLoadGraficaPingFiltro = false;
      });
  }

  graficarDistritos(dep: string, prov: string, desde: string, hasta: string) {
    this.showLoadDistritosPing = true;
    this._opensignalService
      .obtenerLatenciaxDistrito(dep, prov, desde, hasta)
      .subscribe((resp) => {
        this.datosDistrito = resp;
        this.showLoadDistritosPing = false;
      });
  }
}
