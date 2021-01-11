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

  // obtenerGraficoAgrupadoPing(desde: string, hasta: string) {
  //   console.log(desde);
  //   const url = `${URL_SERVICIOS}/ping/opensignal/historico?desde=${desde}&hasta=${hasta}`;
  //   return this.http.get(url).pipe(
  //     map((resp: any) => {
  //       resp.datos.forEach((element) => {
  //         element.latencias.map((item) => {
  //           item.series.map((e) => (e.name = new Date(e.name)));
  //         }),
  //           element.hosts.map((item) => {
  //             item.metricas.map((els) => {
  //               els.series.map((e) => (e.name = new Date(e.name)));
  //             });
  //           });
  //       });
  //       console.log(resp);
  //       return resp;
  //     })
  //   );
  // }

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

  obtenerTipoZonaTestPing(zona: string, dep: string = "") {
    const url = URL_SERVICIOS + `/apping/${zona}/opensignal?dep=${dep}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }
  obtenerLatenciaxDistrito(
    adminArea: string,
    subAdminArea: string,
    desde: string,
    hasta: string
  ) {
    const url =
      URL_SERVICIOS +
      `/apping/opensignal/${adminArea}/${subAdminArea}/distritos/stacked?desde=${desde}&hasta=${hasta}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.datos;
      })
    );
  }

  obtenerTipoRedMovilPing() {
    const url = URL_SERVICIOS + `/apping/redmovil/opensignal`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }

  obtenerOperadoresMovilPing() {
    const url = URL_SERVICIOS + `/apping/operadores/opensignal`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }

  obtenerCellIdPing() {
    const url = URL_SERVICIOS + `/apping/cellid/opensignal`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }

  obtenerGraficoDiarioPing(desde: string, hasta: string) {
    const url = `${URL_SERVICIOS}/apping/opensignal?desde=${desde}&hasta=${hasta}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        resp.data.forEach((datoOperador) => {
          datoOperador.series.map((el) => {
            el.name = new Date(el.name);
          });
        });
        return resp;
      })
    );
  }

  obtenerGraficosFiltrosPing(desde: string, hasta: string, body: any) {
    const url = `${URL_SERVICIOS}/apping/opensignal/filtro?desde=${desde}&hasta=${hasta}`;
    return this.http.post(url, body).pipe(
      map((resp: any) => {
        resp.data.forEach((datoOperador) => {
          datoOperador.series.map((el) => {
            el.name = new Date(el.name);
          });
        });
        return resp.data;
      })
    );
  }
}
