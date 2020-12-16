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

  checkedClaro: boolean = true;
  checkedTdp: boolean = true;

  datosPingFiltro: any[];

  checkServidor: any[] = [];
  checkAdminArea: any[] = [];
  checkLocalidad: any[] = [];
  checkTecnologia: any[] = [];
  checkOperador: any[] = [];

  datosPing: any[];
  showLoadPing: boolean = true;
  datosGraficaPingFiltro: any[];
  showLoadGraficaPingFiltro: boolean = true;
  view: string;

  urlsTutela: any[];

  cellids: any[];
  provincias: any[];
  localidades: any[];
  tecnologias: any[];
  filteredOptions: Observable<string[]>;

  servidor: string[];

  constructor(
    private _opensignalService: OpensignalService,
    private _fechaService: FechaLocalService,
    private activeRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activeRouter.params.subscribe((param) => {
      this.view = param["id"];
      this.cargarGraficoGeneral(
        this._fechaService.corta(-30, "yyyy-MM-dd"),
        this._fechaService.cortaSig("yyyy-MM-dd")
      );
      this.cargarUrlIpsTutela();
      this.cargarProvincias();
      this.cargarLocalidades();
      this.cargarTecnologias();
      this.cargarCellIds();
    });
  }

  cargarGraficoGeneral(desde: string, hasta: string) {
    this.showLoadPing = true;
    this._opensignalService
      .obtenerGraficoDiarioPing(desde, hasta)
      .subscribe((resp) => {
        this.datosPing = resp.data;
        this.showLoadPing = false;
      });
  }

  filter(value: string): string[] {
    return this.cellids
      .map((x) => x.cellid)
      .filter((option) => option.toString().indexOf(value) == 0);
  }

  cargarUrlIpsTutela() {
    this._opensignalService.obtenerIpsOpenSignal().subscribe((resp) => {
      this.urlsTutela = resp;
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
    if (this.checkedClaro) this.datosPingFiltro.push({ operador: "Claro" });
    if (this.checkedTdp) this.datosPingFiltro.push({ operador: "movistar" });

    if (cellid != null && cellid != "") this.datosPingFiltro.push({ cellid });

    this._opensignalService
      .obtenerGraficosFiltrosPing(desde, hasta, this.datosPingFiltro)
      .subscribe((resp) => {
        this.datosGraficaPingFiltro = resp;
        this.showLoadGraficaPingFiltro = false;
      });
  }
}
