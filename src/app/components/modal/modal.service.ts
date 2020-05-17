import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  public show: string;
  public notificacion = new EventEmitter<any>();
  constructor() {}

  ocultarModal() {
    this.show = "";
  }

  mostrarModal() {
    this.show = "show";
  }
}
