import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { PcsAmazon } from "src/app/models/pcs-amazon.model";

@Injectable()
export class AmazonService {
  constructor(public http: HttpClient) {}

  obtenerPrefixAmazon(desde?: number) {
    var url = URL_SERVICIOS + "/amazon/";
    if (desde) {
      url += "?desde=" + desde;
    }

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  buscarPrefixAmazon(ip: string, desde: number = 0) {
    const url = URL_SERVICIOS + "/amazon/" + ip + "?desde=" + desde;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  pingAngular(ip: string) {
    let timeStart: number = performance.now();
    return this.http
      .get("http://" + ip, {
        observe: "response",
      })
      .pipe(
        map((resp) => {
          return resp.body;
        })
      );
  }

  testping(ip: string) {
    const url = URL_SERVICIOS + "/amazon/ping/" + ip;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  cargarPrefixAmazon() {
    const url = URL_SERVICIOS + "/amazon/ips";
    return this.http.post(url, {}).pipe(
      map((resp: any) => {
        Swal.fire({
          icon: "success",
          title: "Prefijo actualizados",
          showConfirmButton: false,
          timer: 1500,
        });

        return true;
      })
    );
  }

  cargarRegionesAmazon() {
    const url = URL_SERVICIOS + "/amazon/regiones";
    return this.http.post(url, {}).pipe(
      map((resp: any) => {
        Swal.fire({
          icon: "success",
          title: "Regiones actualizadas",
          showConfirmButton: false,
          timer: 1500,
        });

        return true;
      })
    );
  }

  guardarPc(pc: PcsAmazon) {
    const url = URL_SERVICIOS + "/amazon/pc";
    return this.http.post(url, pc).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Pc guardada",
          showConfirmButton: false,
          timer: 1500,
        });

        return true;
      })
    );
  }

  obtenerPcs() {
    const url = URL_SERVICIOS + "/amazon/pcs/ec2";
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.pcs;
      })
    );
  }

  guardarMetricasDelay(datos: any) {
    const url = URL_SERVICIOS + "/amazon/metricas/delay";
    return this.http.post(url, datos).pipe(
      map((resp) => {
        return true;
      })
    );
  }

  obtenerMetricasDelay() {
    const url = URL_SERVICIOS + "/amazon/metricas/delay";
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.datos;
      })
    );
  }
}
