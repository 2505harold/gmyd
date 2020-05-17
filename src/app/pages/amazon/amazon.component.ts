import { Component, OnInit, OnDestroy } from "@angular/core";
import { AmazonService, UsuarioService } from "src/app/services/service.index";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatePipe, JsonPipe } from "@angular/common";

//declare function init_plugins();

@Component({
  selector: "app-amazon",
  templateUrl: "./amazon.component.html",
  styles: [],
})
export class AmazonComponent implements OnDestroy {
  inicio;
  fin;
  form: FormGroup;
  prefijos: any;
  carga: boolean = true;
  desde: number = 0;
  totalRegistro: number = 0;
  relativoRegistro: number = 0;
  tiempo: Array<number>;
  imageSrc: string = "";
  data: Array<object> = [];
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
    if (usuario.correo === "harold.japur@iclaro.com.pe") {
      console.log("contador delay");
      this.metricasDelay();
    }

    this.inicializarFechas();
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
    let siguiente = actual.setDate(actual.getDate() + 1);
    let anterior = actual.setDate(actual.getDate() - 2);
    this.inicio = this.datePipe.transform(anterior, "yyyy-MM-dd");
    this.fin = this.datePipe.transform(siguiente, "yyyy-MM-dd");
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
}
