import { Component, OnInit, OnDestroy } from "@angular/core";
import { AmazonService } from "src/app/services/service.index";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { interval } from "rxjs/internal/observable/interval";
import { isNgTemplate } from "@angular/compiler";

@Component({
  selector: "app-amazon",
  templateUrl: "./amazon.component.html",
  styles: [],
})
export class AmazonComponent implements OnDestroy {
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
  pcs = [
    {
      img: "../../../assets/images/estados-unidos-de-america.svg",
      region: "oregon",
      ip: "34.223.228.236",
      delay: null,
    },
    {
      img: "../../../assets/images/estados-unidos-de-america.svg",
      region: "north virginia",
      ip: "52.90.140.184",
      delay: null,
    },
    {
      img: "../../../assets/images/estados-unidos-de-america.svg",
      region: "ohio",
      ip: "3.22.194.90",
      delay: null,
    },
    {
      img: "../../../assets/images/brasil.svg",
      region: "brasil",
      ip: "54.233.154.2",
      delay: null,
    },
  ];

  datos = [];
  view: any[];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = "Fecha";
  yAxisLabel: string = "Puntos";
  timeline: boolean = false;

  colorScheme = {
    domain: ["#dc3545", "#007bff", "#28a745", "#ffc107", "#a8385d", "#aae3f5"],
  };

  constructor(public _amazonService: AmazonService) {
    this.metricasDelay();
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

  //llenar tabla de prefijos amazon
  cargarPrefijosAmazon() {
    this.carga = true;
    this._amazonService.obtenerPrefixAmazon(this.desde).subscribe((resp) => {
      this.prefijos = resp.ipsamazon;
      this.totalRegistro = resp.total;
      this.relativoRegistro = resp.relativo;
      this.carga = false;
    });
  }

  metricasDelay() {
    this.intervalo = setInterval(() => {
      this.pcs.forEach((pc) => {
        let start = performance.now();
        this._amazonService.pingAngular(pc.ip).subscribe((resp: any) => {
          let end = performance.now();
          let time = end - start - 7;
          pc.delay = time;
        });
      });
      this.data.push({ fecha: new Date(), delays: this.pcs });
    }, 5000);
    this.loadDatosChart();
    console.log("paso");
  }

  // let estructura = [
  //   {
  //     name: "ohio",
  //     series: [
  //       { name: "fecha1", value: "2" },
  //       { name: "fecha2", value: "2" },
  //     ],
  //   },
  // ];

  loadDatosChart() {
    var datos = [];
    this.pcs.forEach((pc, index) => {
      var series = [];
      this.data.forEach((medicion: any) => {
        series.push({
          name: medicion.fecha,
          value: medicion.delays[index]["delay"],
        });
      });
      datos.push({ name: pc.region, series: series });
    });

    this.datos = datos;
    console.log(datos);
    console.log(this.data);
  }

  //buscar
  buscar() {
    if (!this.form.invalid) {
      this.carga = true;
      this._amazonService
        .buscarPrefixAmazon(this.form.value.ip)
        .subscribe((resp) => {
          this.prefijos = resp.ipsamazon;
          this.totalRegistro = resp.total;
          this.relativoRegistro = resp.relativo;
          this.desde = 0;
          this.carga = false;
        });
    }
  }

  //prueba de ping
  testPing(prefijo: any) {
    let ip: string;
    switch (prefijo.region) {
      case "us-west-2":
        ip = "34.223.228.236"; //oregon
        break;
      case "us-east-1":
        ip = "52.90.140.184"; //north virginia
        break;
      case "us-east-2":
        ip = "3.22.194.90"; //ohio
        break;
      case "sa-east-1":
        ip = "54.233.154.2"; //sap paolo
        break;
    }

    let start = performance.now();

    // this._amazonService.pingAngular(ip).subscribe((resp: any) => {
    //   let end = performance.now();
    //   this.tiempo = end - start - 7;
    // });
  }

  //actualizar prefijos de amazon
  prefixAmazon() {
    this._amazonService.cargarPrefixAmazon().subscribe();
  }
  //actualizar regiones de amazon
  regionAmazon() {
    this._amazonService.cargarRegionesAmazon().subscribe();
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
