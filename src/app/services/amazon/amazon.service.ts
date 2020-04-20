import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../../config/global";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";

@Injectable()
export class AmazonService {
  constructor(public http: HttpClient) {}

  obtenerPrefixAmazon(buscar?: string) {
    var query = "";
    if (buscar) query = "?buscar=" + buscar;

    const url = URL_SERVICIOS + "/amazon" + query;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  testping(ip: string) {
    const url = URL_SERVICIOS + "/amazon/ping/" + ip;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
}
