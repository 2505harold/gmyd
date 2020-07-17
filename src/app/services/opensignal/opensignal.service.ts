import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import { IpsOpenSignal } from "src/app/models/ips.opensignal.model";
import Swal from "sweetalert2";
import * as _ from "lodash";
import { FechaLocalService } from "../fechas/fecha-local.service";

@Injectable()
export class OpensignalService {
  constructor(
    private http: HttpClient,
    private _fechaService: FechaLocalService
  ) {}

  obtenerGraficoPing(desde: string, hasta: string, categoria: string) {
    const url = `${URL_SERVICIOS}/ping/opensignal/grafico/${categoria}?desde=${desde}&hasta=${hasta}`;
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

  obtenerCantidadPruebasPingPorDias() {
    const url = URL_SERVICIOS + "/opensignal/numeros/ping/guardados";
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  eliminarMetricasPingPorFecha(fecha: string) {
    const url = URL_SERVICIOS + "/opensignal/ping/" + fecha;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        if (resp.datos.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Metrica delay eliminada",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "No se realizo la accion. Validar el formato de fechas",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      })
    );
  }
}
