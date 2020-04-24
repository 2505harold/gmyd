import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NperfMeter } from "src/app/models/nperf.meter.model";
import { URL_SERVICIOS } from "src/app/config/global";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";

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

  obtenerSorterMetricas(campo: string, order: string, desde?: number) {
    var url = URL_SERVICIOS + "/nperf/sorter/" + campo + "/" + order;
    if (desde) url += "?desde=" + desde;

    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
}
