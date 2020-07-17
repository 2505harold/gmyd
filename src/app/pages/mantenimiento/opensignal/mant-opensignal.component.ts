import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { OpensignalService } from "src/app/services/opensignal/opensignal.service";
import { IpsOpenSignal } from "src/app/models/ips.opensignal.model";
import { UsuarioService } from "src/app/services/service.index";
import { DatePipe } from "@angular/common";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";

@Component({
  selector: "app-mant-opensignal",
  templateUrl: "./mant-opensignal.component.html",
})
export class MantOpensignalComponent implements OnInit {
  ipOpensignal: IpsOpenSignal = new IpsOpenSignal();
  ipsOpensignal: any[];
  displayedColumns: string[] = ["index", "fecha", "cantidad", "accion"];
  numPingGuardados = new MatTableDataSource();
  loadTblPing: boolean = false;

  constructor(
    private _opensignalService: OpensignalService,
    public _usuarioService: UsuarioService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.cargarTablaIpsOpenSignal();
    this.cargarTablaNumeroPingGuardados();
  }

  //************************************************************** */
  //Metodos del TAB NUEVO REGISTRO
  //************************************************************** */

  Guardar(form: NgForm) {
    if (form.valid) {
      this.ipOpensignal.user = this._usuarioService.id;
      this.ipOpensignal.fecha = this.datePipe.transform(
        new Date(),
        "yyyy-MM-dd"
      );
      this._opensignalService
        .guardarIp(this.ipOpensignal)
        .subscribe((resp) => this.cargarTablaIpsOpenSignal());

      form.reset();
    }
  }

  cargarTablaIpsOpenSignal() {
    this._opensignalService.obtenerIpsOpenSignal().subscribe((resp) => {
      this.ipsOpensignal = resp;
    });
  }

  //************************************************************** */
  //Metodos del TAB NUMERO DE PING GUARDADOS
  //************************************************************** */
  cargarTablaNumeroPingGuardados() {
    this._opensignalService
      .obtenerCantidadPruebasPingPorDias()
      .subscribe((resp: any) => {
        this.numPingGuardados = resp.metricas;
      });
  }

  eliminarFecha(element) {
    Swal.fire({
      title: "Estas seguro?",
      text: "Usted no podra revertir este cambio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrarlo",
    }).then((result) => {
      if (result.value) {
        this.loadTblPing = true;
        this._opensignalService
          .eliminarMetricasPingPorFecha(element._id)
          .subscribe((resp) => {
            this.cargarTablaNumeroPingGuardados();
            this.loadTblPing = false;
          });
      }
    });
  }
}
