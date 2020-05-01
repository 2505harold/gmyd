import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NperfMeter } from "src/app/models/nperf.meter.model";
import { URL_SERVICIOS } from "src/app/config/global";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { NperfVelocidad } from "src/app/models/nperf.velocidad.model";

@Injectable()
export class NperfService {
  puntajes: any[];
  public notificacion = new EventEmitter<any>();

  constructor(public http: HttpClient) {}

  guardarMetricas(metrica: NperfMeter) {
    const url = URL_SERVICIOS + "/nperf";
    return this.http.post(url, metrica).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Accion realizada",
          text: "Se crearon los parametros indicados",
          showConfirmButton: false,
          timer: 1500,
        });
        return resp;
      })
    );
  }

  guardarMetricasVelocidad(metrica: NperfVelocidad) {
    const url = URL_SERVICIOS + "/nperf/velocidad";
    return this.http.post(url, metrica).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Accion realizada",
          text: "Se crearon los parametros indicados",
          showConfirmButton: false,
          timer: 1500,
        });
        return resp;
      })
    );
  }

  establecerPuntajes(puntajes: any) {
    this.puntajes = puntajes;
  }

  obtenerMetricas() {
    const url = URL_SERVICIOS + "/nperf";
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerMetricasVelocidad() {
    const url = URL_SERVICIOS + "/nperf/velocidades";
    return this.http.get(url).pipe(
      map((resp: any) => {
        const operadores = ["claro", "entel", "movistar", "bitel"];
        const metricas = resp.metricas;
        var datos = [];
        operadores.forEach((operador) => {
          var series = [];
          metricas.forEach((objeto) => {
            series.push({
              name: new Date(objeto.fecha_ingreso),
              value: objeto[operador],
            });
          });
          datos.push({ name: operador, series: series });
        });

        return datos;
      })
    );
  }

  obtenerSorterMetricas(
    campo: string,
    order: string,
    desde?: number,
    limite?: number
  ) {
    var url = URL_SERVICIOS + "/nperf/sorter/" + campo + "/" + order;
    if (desde && limite) url += "?desde=" + desde + "&limite=" + limite;
    else if (desde) url += "?desde=" + desde;
    else if (limite) url += "?limite=" + limite;
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerSorterMetricasVelocidades(
    campo: string,
    order: string,
    desde?: number,
    limite?: number
  ) {
    var url =
      URL_SERVICIOS + "/nperf/velocidades/sorter/" + campo + "/" + order;
    if (desde && limite) url += "?desde=" + desde + "&limite=" + limite;
    else if (desde) url += "?desde=" + desde;
    else if (limite) url += "?limite=" + limite;
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
}
