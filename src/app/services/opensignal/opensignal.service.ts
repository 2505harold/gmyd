import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import { IpsOpenSignal } from "src/app/models/ips.opensignal.model";
import Swal from "sweetalert2";

@Injectable()
export class OpensignalService {
  constructor(private http: HttpClient) {}

  obtenerGraficoPing(desde: string, hasta: string) {
    const url = `${URL_SERVICIOS}/ping/opensignal/grafico?desde=${desde}&hasta=${hasta}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        resp.datos.forEach((element) => {
          element.metricas.map((item) => {
            item.series.map((el) => (el.name = new Date(el.name)));
          });
        });
        return resp;
      })
    );
  }

  guardarIp(ipOpensignal: IpsOpenSignal) {
    const url = `${URL_SERVICIOS}/opensignal`;
    return this.http.post(url, ipOpensignal).pipe(
      map((resp: any) => {
        Swal.fire({
          icon: "success",
          title: "IP creada satisfactoriamente",
          showConfirmButton: false,
          timer: 1500,
        });
      })
    );
  }

  obtenerIpsOpenSignal() {
    const url = URL_SERVICIOS + "/opensignal";
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.datos;
      })
    );
  }
}
