import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import { IpsTutela } from "src/app/models/ips.tutela.model";
import Swal from "sweetalert2";
import * as _ from "lodash";

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

  obtenerTipoZonaTestPing(zona: string, dep: string = "") {
    const url = URL_SERVICIOS + `/apping/${zona}/tutela?dep=${dep}`;
    return this.http.get(url).pipe(map((resp: any) => resp.data));
  }

  obtenerTipoRedMovilPing() {
    const url = URL_SERVICIOS + `/apping/redmovil/tutela`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }

  obtenerOperadoresMovilPing() {
    const url = URL_SERVICIOS + `/apping/operadores/tutela`;
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
      `/apping/tutela/${adminArea}/${subAdminArea}/distritos/stacked?desde=${desde}&hasta=${hasta}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.datos;
      })
    );
  }

  obtenerFotoLatenciaSite(tipo: string, subregion?: string, top?: number) {
    const query = subregion ? `?subregion=${subregion}&top=${top}` : "";
    const url = URL_SERVICIOS + `/apping/tutela/foto/reporte/sem/delay${query}`;
    return this.http.get(url, {}).pipe(
      map((resp: any) => {
        if (tipo == "grafico") {
          let data = [];
          resp.datos.forEach((el) => {
            data.push({ name: el.nodeName, value: el.delayAvg });
          });

          return data;
        } else {
          return resp.datos;
        }
      })
    );
  }

  obtenerHistoricoLatenciaSite(
    tipo: string,
    desde: string,
    hasta: string,
    subregion?: string
  ) {
    const query = subregion
      ? `?subregion=${subregion}&desde=${desde}&hasta=${hasta}`
      : "";
    const url =
      URL_SERVICIOS + `/apping/tutela/historico/reporte/sem/delay${query}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        if (tipo == "grafico") {
          const groupBySite = _.groupBy(resp.datos, "nodeName");
          var data = [];
          _.forEach(groupBySite, (item) => {
            var series = [];
            _.forEach(item, (el) => {
              series.push({ value: el.delayAvg, name: new Date(el.hasta) });
            });
            data.push({ name: item[0].nodeName, series });
          });
          return data;
        } else {
          return resp.datos;
        }
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

  obtenerCantidadPruebasPingPorDias() {
    const url = URL_SERVICIOS + "/tutela/numeros/ping/guardados";
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  actualizarReporteSemanal(desde: string, hasta: string) {
    const url = `${URL_SERVICIOS}/apping/tutela/cellid/reporte?desde=${desde}&hasta=${hasta}`;
    return this.http.post(url, {});
  }
}
