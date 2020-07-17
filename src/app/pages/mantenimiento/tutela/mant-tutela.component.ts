import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "src/app/services/service.index";
import { IpsTutela } from "src/app/models/ips.tutela.model";
import { NgForm } from "@angular/forms";
import { TutelaService } from "src/app/services/tutela/tutela.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: "app-mant-tutela",
  templateUrl: "./mant-tutela.component.html",
})
export class MantTutelaComponent implements OnInit {
  ipTutela: IpsTutela = new IpsTutela();
  ipsTutela: any[];
  loadTblPing: boolean = true;
  datos: any[];
  displayedColumns: string[] = ["index", "fecha", "cantidad", "accion"];

  constructor(
    public _usuarioService: UsuarioService,
    private _tutelaService: TutelaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.cargarTablaIpsTutela();
    this.cargarTablaNumeroPingGuardados();
  }

  Guardar(form: NgForm) {
    if (form.valid) {
      this.ipTutela.user = this._usuarioService.id;
      this.ipTutela.fecha = this.datePipe.transform(new Date(), "yyyy-MM-dd");
      this._tutelaService
        .guardarIp(this.ipTutela)
        .subscribe((resp) => this.cargarTablaIpsTutela());

      form.reset();
    }
  }

  cargarTablaIpsTutela() {
    this._tutelaService.obtenerIpsTutela().subscribe((resp) => {
      this.ipsTutela = resp;
    });
  }

  //************************************************************** */
  //Metodos del TAB NUMERO DE PING GUARDADOS
  //************************************************************** */
  cargarTablaNumeroPingGuardados() {
    this._tutelaService
      .obtenerCantidadPruebasPingPorDias()
      .subscribe((resp: any) => {
        this.datos = resp.metricas;
        this.loadTblPing = false;
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
        this._tutelaService
          .eliminarMetricasPingPorFecha(element._id)
          .subscribe((resp) => {
            this.cargarTablaNumeroPingGuardados();
            this.loadTblPing = false;
          });
      }
    });
  }
}
