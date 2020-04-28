import { Component, OnInit } from "@angular/core";
import { AmazonService } from "src/app/services/service.index";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-amazon",
  templateUrl: "./amazon.component.html",
  styles: [],
})
export class AmazonComponent implements OnInit {
  form: FormGroup;
  prefijos: any;
  carga: boolean = true;
  desde: number = 0;
  totalRegistro: number = 0;
  relativoRegistro: number = 0;
  tiempo: number;
  imageSrc: string = "";
  timeStart: number;

  constructor(public _amazonService: AmazonService) {}

  ngOnInit() {
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
    var ip = "",
      mask = "";
    if (prefijo.ip_prefix) {
      ip = prefijo.ip_prefix.substring(0, prefijo.ip_prefix.indexOf("/"));
      mask = prefijo.ip_prefix.substring(prefijo.ip_prefix.indexOf("/") + 1);
    } else {
      ip = prefijo;
    }

    let start = performance.now();

    this._amazonService
      .pingAngular("ec2-3-80-0-0.compute-1.amazonaws.com")
      .subscribe((resp: any) => {
        //let end = performance.timing.responseEnd;
        let end = performance.now();

        this.tiempo = end - start;
      });

    //this.timeStart = performance.now();

    //var p = new Ping();

    // p.ping("https://3.80.0.0", function (err, data) {
    //   // Also display error if err is returned.
    //   if (err) {
    //     return performance.now();
    //   }
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
