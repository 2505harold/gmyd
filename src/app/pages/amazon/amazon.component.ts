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

  constructor(public _amazonService: AmazonService) {}

  ngOnInit() {
    this.cargarPrefijosAmazon();
  }

  cargarPrefijosAmazon() {
    this.carga = true;
    this._amazonService.obtenerPrefixAmazon().subscribe((resp) => {
      this.prefijos = resp.ipsamazon;
      this.carga = false;
    });
  }

  buscar(termino: string) {
    this.carga = true;
    this._amazonService.obtenerPrefixAmazon(termino).subscribe((resp) => {
      this.prefijos = resp.ipsamazon;
      this.carga = false;
    });
  }

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

  prefixAmazon() {
    this._amazonService.cargarPrefixAmazon().subscribe();
  }

  regionAmazon() {
    this._amazonService.cargarRegionesAmazon().subscribe();
  }
}
