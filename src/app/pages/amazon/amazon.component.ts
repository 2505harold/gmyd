import { Component, OnInit, OnDestroy } from "@angular/core";
import { AmazonService } from "src/app/services/service.index";
import { FormGroup, FormControl, Validators } from "@angular/forms";

//declare function init_plugins();

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
      public_dns_ipv4: "ec2-34-223-228-236.us-west-2.compute.amazonaws.com",
      delay: null,
    },
    {
      img: "../../../assets/images/estados-unidos-de-america.svg",
      region: "north virginia",
      ip: "52.90.140.184",
      public_dns_ipv4: "ec2-52-90-140-184.compute-1.amazonaws.com",
      delay: null,
    },
    {
      img: "../../../assets/images/estados-unidos-de-america.svg",
      region: "ohio",
      ip: "3.22.194.90",
      public_dns_ipv4: "ec2-3-22-194-90.us-east-2.compute.amazonaws.com",
      delay: null,
    },
    {
      img: "../../../assets/images/estados-unidos-de-america.svg",
      region: "north california",
      ip: "13.57.226.225",
      public_dns_ipv4: "ec2-13-57-226-225.us-west-1.compute.amazonaws.com",
      delay: null,
    },
    {
      img: "../../../assets/images/francia.svg",
      region: "paris",
      public_dns_ipv4: "ec2-35-180-64-184.eu-west-3.compute.amazonaws.com",
      ip: "35.180.64.184",
      delay: null,
    },
    {
      img: "../../../assets/images/brasil.svg",
      region: "brasil",
      ip: "54.233.154.2",
      public_dns_ipv4: "ec2-54-233-154-2.sa-east-1.compute.amazonaws.com",
      delay: null,
    },
  ];

  datos = [];

  constructor(public _amazonService: AmazonService) {
    //init_plugins();
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
      this.pcs.forEach((pc, index) => {
        let start = performance.now();
        this._amazonService
          .pingAngular(pc.public_dns_ipv4)
          .subscribe((resp: any) => {
            let end = performance.now();
            let time = end - start - 7;
            pc.delay = time;
          });
      });
      this.data.push({ fecha: new Date(), delays: this.pcs });
    }, 5000);
    this.loadDatosChart();
  }

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
