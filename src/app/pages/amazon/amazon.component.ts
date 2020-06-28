import { Component, OnInit, OnDestroy } from "@angular/core";
import { AmazonService, UsuarioService } from "src/app/services/service.index";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";

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

  datos = [];

  constructor(
    public _amazonService: AmazonService,
    public datePipe: DatePipe,
    public _usuarioService: UsuarioService
  ) {
    const usuario = _usuarioService.usuario;
    if (usuario.correo === "test3@test.com") {
      this.metricasDelay();
    }

    this.inicializarFechas();
    this.obtenerPruebasPingAmazonBrasil("sa-east-1", this.hoy, this.fin);
    this.obtenerPruebasPingAmazonNorthCalifornia(
      "us-west-1",
      this.hoy,
      this.fin
    );
    this.obtenerPruebasPingAmazonOhio("us-east-2", this.hoy, this.fin);
    this.obtenerPruebasPingAmazonNorthVirginia("us-east-1", this.hoy, this.fin);
    this.loadDatosChart(this.inicio, this.fin);
    this.cargarPrefijosAmazon();
    this.form = new FormGroup({
      ip: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
        ),
      ]),
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  inicializarFechas() {
    let actual = new Date();
    let siguiente = actual.setDate(actual.getDate() + 1); // sumo un dia al actual
    let anterior = actual.setDate(actual.getDate() - 2); // le resto dos dias
    let hoy = actual.setDate(actual.getDate() + 1); //le sumo un dia
    this.inicio = this.datePipe.transform(anterior, "yyyy-MM-dd");
    this.fin = this.datePipe.transform(siguiente, "yyyy-MM-dd");
    this.hoy = this.datePipe.transform(hoy, "yyyy-MM-dd");
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

  metricasDelay() {
    this.intervalo = setInterval(() => {
      this._amazonService.obtenerPcs().subscribe((resp) => {
        let fecha = new Date();
        resp.forEach((item, index) => {
          let start = performance.now();
          this._amazonService.pingAngular(item.dns).subscribe((resp: any) => {
            let end = performance.now();
            let time = end - start - 7;
            this._amazonService
              .guardarMetricasDelay({
                fecha,
                pc: item._id,
                delay: time,
              })
              .subscribe();
          });
        });
      });
    }, 300000);
  }

  actualizarGrafico() {
    this.loadDatosChart(this.inicio, this.fin);
  }

  loadDatosChart(desde: string, hasta: string) {
    this.loadGraficoDelay = true;
    this._amazonService
      .obtenerMetricasDelayGrafico(desde, hasta)
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

  //click en siguinete o anterior
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
      .obtenerPruebasPingAmazon(region, desde, hasta)
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
      .obtenerPruebasPingAmazon(region, desde, hasta)
      .subscribe((resp) => {
        this.dataPing2 = resp;
        this.showloadCharNorthCalifornia = false;
      });
  }
  obtenerPruebasPingAmazonOhio(region: string, desde: string, hasta: string) {
    this._amazonService
      .obtenerPruebasPingAmazon(region, desde, hasta)
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
      .obtenerPruebasPingAmazon(region, desde, hasta)
      .subscribe((resp) => {
        this.dataPing4 = resp;
        this.showloadCharNorthVirginia = false;
      });
  }
}
