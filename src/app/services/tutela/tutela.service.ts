import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import { IpsTutela } from "src/app/models/ips.tutela.model";
import Swal from "sweetalert2";

@Injectable()
export class TutelaService {
  constructor(private http: HttpClient) {}

  guardarIp(iptutela: IpsTutela) {
    const url = `${URL_SERVICIOS}/tutela`;
    return this.http.post(url, iptutela).pipe(
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

  obtenerIpsTutela() {
    const url = URL_SERVICIOS + "/tutela";
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.ips;
      })
    );
  }

  obtenerTipoZonaTestPing(zona: string) {
    const url = URL_SERVICIOS + `/apping/${zona}/tutela`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }

  obtenerTipoRedMovilPing() {
    const url = URL_SERVICIOS + `/apping/redmovil/tutela`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }

  obtenerCellIdPing() {
    const url = URL_SERVICIOS + `/apping/cellid/tutela`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }

  obtenerGraficoDiarioPing(desde: string, hasta: string) {
    const url = `${URL_SERVICIOS}/apping/tutela?desde=${desde}&hasta=${hasta}`;
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
    const url = `${URL_SERVICIOS}/apping/tutela/filtro?desde=${desde}&hasta=${hasta}`;
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

  eliminarMetricasPingPorFecha(fecha: string) {
    const url = URL_SERVICIOS + "/tutela/ping/" + fecha;
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

  // obtenerGraficoAgrupadoPing(desde: string, hasta: string) {
  //   const url = `${URL_SERVICIOS}/ping/tutela/historico?desde=${desde}&hasta=${hasta}`;
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

  obtenerCantidadPruebasPingPorDias() {
    const url = URL_SERVICIOS + "/tutela/numeros/ping/guardados";
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
}
