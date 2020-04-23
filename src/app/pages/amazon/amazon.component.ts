import { Component, OnInit } from "@angular/core";
import { AmazonService } from "src/app/services/service.index";
import { IpsAmazon } from "src/app/models/ips.amazon.model";
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
      this.carga = false;
    });
  }

  //buscar
  buscar(termino: string) {
    this.carga = true;
    this._amazonService.buscarPrefixAmazon(termino).subscribe((resp) => {
      this.prefijos = resp.ipsamazon;
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

    console.log(ip);
    this._amazonService.testping(ip).subscribe((resp) => {
      console.log(resp.avg);
      if (resp.avg != "unknown") {
        Swal.fire({
          icon: "success",
          title: resp.avg,
          text: "Hay conectividad",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: resp.avg,
          text: "No Hay respuesta",
        });
      }
    });
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
