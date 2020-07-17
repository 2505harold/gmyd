import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import { IpsTutela } from "src/app/models/ips.tutela.model";
import Swal from "sweetalert2";

@Injectable()
export class TutelaService {
  constructor(private http: HttpClient) {}

  obtenerPruebasPingTutela(
    categoria: string,
    tipo: string,
    desde: string,
    hasta: string
  ) {
    const url = `${URL_SERVICIOS}/ping/tutela/${categoria}/${tipo}?desde=${desde}&hasta=${hasta}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        const ips = resp.datos.map((el) => el._id.ip);
        let datos = [];
        ips.forEach((ip) => {
          var series = resp.datos.reduce((series, item) => {
            if (item._id.ip === ip) {
              series.push({
                name: item._id.operador,
                value: parseFloat(item.avg.$numberDecimal).toFixed(1),
              });
            }
            return series;
          }, []);
          datos.push({ name: ip, series });
        });
        return datos;
      })
    );
  }

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

  obtenerGraficoPing(
    categoria: string,
    tipo: string,
    desde: string,
    hasta: string
  ) {
    const url = `${URL_SERVICIOS}/ping/tutela/grafico/${categoria}/${tipo}?desde=${desde}&hasta=${hasta}`;
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

  obtenerCantidadPruebasPingPorDias() {
    const url = URL_SERVICIOS + "/tutela/numeros/ping/guardados";
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
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
}
