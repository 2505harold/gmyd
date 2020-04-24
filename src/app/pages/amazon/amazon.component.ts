import { Component, OnInit } from "@angular/core";
import { AmazonService } from "src/app/services/service.index";
import { IpsAmazon } from "src/app/models/ips.amazon.model";
import ping from "ping";
import Ping from "ping.js";
import Swal from "sweetalert2";

@Component({
  selector: "app-amazon",
  templateUrl: "./amazon.component.html",
  styles: [],
})
export class AmazonComponent implements OnInit {
  prefijos: IpsAmazon[] = [];
  carga: boolean = true;
  desde: number = 0;
  totalRegistro: number = 0;
  relativoRegistro: number = 0;

  constructor(public _amazonService: AmazonService) {}

  ngOnInit() {
    this.cargarPrefijosAmazon();
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
  buscar(termino: string) {
    this.carga = true;
    this._amazonService.buscarPrefixAmazon(termino).subscribe((resp) => {
      this.prefijos = resp.ipsamazon;
      this.totalRegistro = resp.total;
      this.relativoRegistro = resp.relativo;
      this.carga = false;
    });
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

    // var p = new Ping();

    // p.ping(ip, function (err, data) {
    //   // Also display error if err is returned.
    //   if (err) {
    //     console.log("error loading resource");
    //     data = data + " " + err;
    //   }
    //   console.log(data);
    // });

    this._amazonService.pingAngular(ip).subscribe((resp) => {
      console.log(resp);
    });
    // var ip = prefijo.ip_prefix.substring(0, prefijo.ip_prefix.indexOf("/"));
    // ping.promise
    //   .probe(ip.trim())
    //   .then(function (res) {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // this._amazonService.testping(ip).subscribe((resp) => {
    //   console.log(resp.avg);
    //   if (resp.avg != "unknown") {
    //     Swal.fire({
    //       icon: "success",
    //       title: resp.avg,
    //       text: "Hay conectividad",
    //     });
    //   } else {
    //     Swal.fire({
    //       icon: "error",
    //       title: resp.avg,
    //       text: "No Hay respuesta",
    //     });
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
