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
    console.log(prefijo);
    const ip = prefijo.ip_prefix.substring(0, prefijo.ip_prefix.indexOf("/"));
    const mask = prefijo.ip_prefix.substring(
      prefijo.ip_prefix.indexOf("/") + 1
    );
    this._amazonService.testping("52.92.72.1").subscribe((resp) => {
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
}
