import { Component, OnInit, OnDestroy } from "@angular/core";
import { AmazonService, UsuarioService } from "src/app/services/service.index";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { FechaLocalService } from "src/app/services/fechas/fecha-local.service";

//declare function init_plugins();

@Component({
  selector: "app-amazon",
  templateUrl: "./amazon.component.html",
  styles: [],
})
export class AmazonComponent implements OnDestroy {
  inicio;
  fin;
  hoy;
  form: FormGroup;
  prefijos: any;
  carga: boolean = true;
  desde: number = 0;
  totalRegistro: number = 0;
  relativoRegistro: number = 0;
  tiempo: Array<number>;
  imageSrc: string = "";
  data: Array<object> = [];
  dataPing: any = [];
  dataPing2: any = []; //north california
  dataPing3: any = []; //ohio
  dataPing4: any = []; //north virginia
  showloadCharNorthCalifornia: boolean = true;
  showloadCharOhio: boolean = true;
  showloadCharNorthVirginia: boolean = true;
  showloadCharBrasil: boolean = true;
  timeStart: number;
  intervalo;
  view: string;

  datosClaro: any[];
  datosEntel: any[];
  datosBitel: any[];
  datosMovistar: any[];
  loadGraficoClaro: boolean = true;
  loadGraficoEntel: boolean = true;
  loadGraficoMovistar: boolean = true;
  loadGraficoBitel: boolean = true;

  from: string;
  to: string;

  //Contructores
  constructor(
    public _amazonService: AmazonService,
    public datePipe: DatePipe,
    public _usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private _fechaService: FechaLocalService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.view = params["tipo"];

      (this.from = this._fechaService.corta(-30, "yyyy-MM-dd")),
        (this.to = this._fechaService.cortaSig("yyyy-MM-dd"));

      this.obtenerPruebasPingAmazonBrasil("sa-east-1", this.from, this.to);
      this.obtenerPruebasPingAmazonNorthCalifornia(
        "us-west-1",
        this.from,
        this.to
      );
      this.obtenerPruebasPingAmazonOhio("us-east-2", this.from, this.to);
      this.obtenerPruebasPingAmazonNorthVirginia(
        "us-east-1",
        this.from,
        this.to
      );
      this.loadDatosChartClaro("mobile", this.from, this.to);
      this.loadDatosChartMovistar("mobile", this.from, this.to);
      this.loadDatosChartEntel("mobile", this.from, this.to);
      this.loadDatosChartBitel("mobile", this.from, this.to);
      this.cargarPrefijosAmazon();
      this.form = new FormGroup({
        ip: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
          ),
        ]),
      });
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  //llenar tabla de prefijos amazon
  cargarPrefijosAmazon() {
    this.carga = true;
    this._amazonService
      .obtenerPrefixAmazon("todo", this.desde)
      .subscribe((resp) => {
        this.prefijos = resp.ipsamazon;
        this.totalRegistro = resp.total;
        this.relativoRegistro = resp.relativo;
        this.carga = false;
      });
  }

  actualizarGrafico() {
    this.loadDatosChartClaro(this.view, this.inicio, this.fin);
  }

  loadDatosChartClaro(categoria: string, desde: string, hasta: string) {
    this.loadGraficoClaro = true;
    this._amazonService
      .obtenerPingGrafico(categoria, "claro", desde, hasta)
      .subscribe((resp) => {
        this.datosClaro = resp;
        this.loadGraficoClaro = false;
      });
  }
  loadDatosChartEntel(categoria: string, desde: string, hasta: string) {
    this.loadGraficoEntel = true;
    this._amazonService
      .obtenerPingGrafico(categoria, "entel", desde, hasta)
      .subscribe((resp) => {
        this.datosEntel = resp;
        this.loadGraficoEntel = false;
      });
  }
  loadDatosChartMovistar(categoria: string, desde: string, hasta: string) {
    this.loadGraficoMovistar = true;
    this._amazonService
      .obtenerPingGrafico(categoria, "movistar", desde, hasta)
      .subscribe((resp) => {
        this.datosMovistar = resp;
        this.loadGraficoMovistar = false;
      });
  }
  loadDatosChartBitel(categoria: string, desde: string, hasta: string) {
    this.loadGraficoBitel = true;
    this._amazonService
      .obtenerPingGrafico(categoria, "bitel", desde, hasta)
      .subscribe((resp) => {
        this.datosBitel = resp;
        this.loadGraficoBitel = false;
      });
  }

  //buscar
  buscar() {
    if (!this.form.invalid) {
      this.carga = true;
      this._amazonService
        .buscarIpPrefixAmazon(this.form.value.ip)
        .subscribe((resp) => {
          this.prefijos = resp.ipsamazon;
          this.totalRegistro = resp.total;
          this.relativoRegistro = resp.relativo;
          this.desde = 0;
          this.carga = false;
        });
    }
  }

  //click en siguiente o anterior
  continuar(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistro) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarPrefijosAmazon();
  }

  //obtiene el comparativo de ping
  obtenerPruebasPingAmazonBrasil(region: string, desde: string, hasta: string) {
    this.showloadCharBrasil = true;
    this._amazonService
      .obtenerPruebasPingPorIp(region, desde, hasta)
      .subscribe((resp) => {
        console.log(resp);
        this.dataPing = resp;
        this.showloadCharBrasil = false;
      });
  }
  obtenerPruebasPingAmazonNorthCalifornia(
    region: string,
    desde: string,
    hasta: string
  ) {
    this.showloadCharNorthCalifornia = true;
    this._amazonService
      .obtenerPruebasPingPorIp(region, desde, hasta)
      .subscribe((resp) => {
        this.dataPing2 = resp;
        this.showloadCharNorthCalifornia = false;
      });
  }
  obtenerPruebasPingAmazonOhio(region: string, desde: string, hasta: string) {
    this.showloadCharOhio = true;
    this._amazonService
      .obtenerPruebasPingPorIp(region, desde, hasta)
      .subscribe((resp) => {
        this.dataPing3 = resp;
        this.showloadCharOhio = false;
      });
  }
  obtenerPruebasPingAmazonNorthVirginia(
    region: string,
    desde: string,
    hasta: string
  ) {
    this.showloadCharNorthVirginia = true;
    this._amazonService
      .obtenerPruebasPingPorIp(region, desde, hasta)
      .subscribe((resp) => {
        this.dataPing4 = resp;
        this.showloadCharNorthVirginia = false;
      });
  }
}
