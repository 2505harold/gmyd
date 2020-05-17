import { Injectable } from "@angular/core";
import { LinksInternacionales } from "../models/links-internacional.model";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "../config/global";
import { map } from "rxjs/internal/operators/map";
import Swal from "sweetalert2";

@Injectable()
export class InternacionalService {
  constructor(private http: HttpClient) {}

  guardarLink(enlace: LinksInternacionales) {
    const url = URL_SERVICIOS + "/internacional";
    return this.http.post(url, enlace).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Equipo de enlace creado",
          showConfirmButton: false,
          timer: 1500,
        });
        return true;
      })
    );
  }

  obtenerLink() {
    const url = URL_SERVICIOS + "/internacional";
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.enlaces;
      })
    );
  }

  eliminarLink(id: string) {
    const url = URL_SERVICIOS + "/internacional/" + id;
    return this.http.delete(url).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Equipo de enlace eliminado",
          showConfirmButton: false,
          timer: 1500,
        });
      })
    );
  }

  actualizarLink(id: string, enlace: LinksInternacionales) {
    const url = URL_SERVICIOS + "/internacional/" + id;
    return this.http.put(url, enlace).pipe(
      map((resp) => {
        Swal.fire({
          icon: "success",
          title: "Equipo de enlace actualizado",
          showConfirmButton: false,
          timer: 1500,
        });
      })
    );
  }
}
