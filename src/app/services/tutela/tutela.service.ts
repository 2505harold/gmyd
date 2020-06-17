import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import { IpsTutela } from "src/app/models/ips.tutela.model";

@Injectable()
export class TutelaService {
  constructor(private http: HttpClient) {}

  obtenerPruebasPingTutela(tipo: string, desde: string, hasta: string) {
    const url = `${URL_SERVICIOS}/ping/tutela/${tipo}?desde=${desde}&hasta=${hasta}`;
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
}
