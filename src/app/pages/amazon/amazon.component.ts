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
  loadGraficoDelay: boolean = true;
  view: string;

  datos: any[];

  constructor(
    public _amazonService: AmazonService,
    public datePipe: DatePipe,
    public _usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private _fechaService: FechaLocalService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.view = params["tipo"];

      this.obtenerPruebasPingAmazonBrasil(
        "sa-east-1",
        this._fechaService.localCorta(),
        this._fechaService.cortaSig()
      );
      this.obtenerPruebasPingAmazonNorthCalifornia(
        "us-west-1",
        this._fechaService.localCorta(),
        this._fechaService.cortaSig()
      );
      this.obtenerPruebasPingAmazonOhio(
        "us-east-2",
        this._fechaService.localCorta(),
        this._fechaService.cortaSig()
      );
      this.obtenerPruebasPingAmazonNorthVirginia(
        "us-east-1",
        this._fechaService.localCorta(),
        this._fechaService.cortaSig()
      );
      this.loadDatosChart(
        this.view,
        this._fechaService.corta(-6),
        this._fechaService.cortaSig()
      );
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
    this.loadDatosChart(this.view, this.inicio, this.fin);
  }

  loadDatosChart(categoria: string, desde: string, hasta: string) {
    this.loadGraficoDelay = true;
    this._amazonService
      .obtenerPingGrafico(categoria, desde, hasta)
      .subscribe((resp) => {
        this.datos = resp;
        this.loadGraficoDelay = false;
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

  //obtiene el comprativo de ping
  obtenerPruebasPingAmazonBrasil(region: string, desde: string, hasta: string) {
    this._amazonService
      .obtenerPruebasPingAmazon(this.view, region, desde, hasta)
      .subscribe((resp) => {
        this.dataPing = resp;
        this.showloadCharBrasil = false;
      });
  }
  obtenerPruebasPingAmazonNorthCalifornia(
    region: string,
    desde: string,
    hasta: string
  ) {
    this._amazonService
      .obtenerPruebasPingAmazon(this.view, region, desde, hasta)
      .subscribe((resp) => {
        this.dataPing2 = resp;
        this.showloadCharNorthCalifornia = false;
      });
  }
  obtenerPruebasPingAmazonOhio(region: string, desde: string, hasta: string) {
    this._amazonService
      .obtenerPruebasPingAmazon(this.view, region, desde, hasta)
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
    this._amazonService
      .obtenerPruebasPingAmazon(this.view, region, desde, hasta)
      .subscribe((resp) => {
        this.dataPing4 = resp;
        this.showloadCharNorthVirginia = false;
      });
  }
}
