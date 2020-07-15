import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { PcsAmazon } from "src/app/models/pcs-amazon.model";
import { IpsAmazon } from "src/app/models/ips.amazon.model";

@Injectable()
export class AmazonService {
  constructor(public http: HttpClient) {}

  //obtiene los prefijos con el detalle de la region
  obtenerPrefixAmazon(buscar: string, desde?: number, limite?: number) {
    var url = URL_SERVICIOS + "/amazon/";

    if (limite && desde) {
      url += "?buscar=" + buscar + "&desde=" + desde + "&limite=" + limite;
    } else if (desde) {
      url += "?buscar=" + buscar + "&desde=" + desde;
    } else if (limite) {
      url += "?buscar=" + buscar + "&limite=" + limite;
    }

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  buscarIpPrefixAmazon(ip: string, desde: number = 0) {
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

  //metodo para actualizar prefijos de amazon
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

  actualizarEquipoPrefijosAmazon(prefijo: IpsAmazon) {
    const url = URL_SERVICIOS + "/amazon/ips/" + prefijo._id;
    return this.http.put(url, prefijo).pipe(
      map((resp: any) => {
        Swal.fire({
          icon: "success",
          title: "Prefijo actualizado",
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

  obtenerMetricasDelayGrafico(desde: string, hasta: string) {
    const url =
      URL_SERVICIOS +
      "/amazon/metricas/delay" +
      "?inicio=" +
      desde +
      "&fin=" +
      hasta;
    return this.http.get(url).pipe(
      map((resp: any) => {
        var datos = [];
        const pcs = resp.pcs;
        const delays = resp.delays;
        pcs.forEach((pc) => {
          var series = delays.reduce((series, item) => {
            if (item.pc === pc._id) {
              series.push({ name: new Date(item.fecha), value: item.delay });
            }
            return series;
          }, []);
          datos.push({ name: pc.region, series });
        });
        return datos;
      })
    );
  }

  obtenerAgrupadoMetricasDelayByDias() {
    const url = URL_SERVICIOS + "/amazon/metricas/delay/guardados";
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  eliminarMetricaDelayByFecha(fecha: string) {
    const url = URL_SERVICIOS + "/amazon/metricas/delay/" + fecha;
    return this.http.delete(url).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Metrica delay eliminada",
          showConfirmButton: false,
          timer: 1500,
        });
      })
    );
  }

  obtenerPruebasPingAmazon(
    categoria: string,
    region: string,
    desde: string,
    hasta
  ) {
    const url = `${URL_SERVICIOS}/ping/amazon/${categoria}/${region}?desde=${desde}&hasta=${hasta}`;
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

  obtenerCantidadPruebasPingPorDias() {
    const url = URL_SERVICIOS + "/amazon/numeros/ping/guardados";
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  eliminarMetricasPingPorFecha(fecha: string) {
    const url = URL_SERVICIOS + "/amazon/ping/" + fecha;
    return this.http.delete(url).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Metrica delay eliminada",
          showConfirmButton: false,
          timer: 1500,
        });
      })
    );
  }
}
