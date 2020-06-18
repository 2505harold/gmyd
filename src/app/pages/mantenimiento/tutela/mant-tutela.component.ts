import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "src/app/services/service.index";
import { IpsTutela } from "src/app/models/ips.tutela.model";
import { NgForm } from "@angular/forms";
import { TutelaService } from "src/app/services/tutela/tutela.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-mant-tutela",
  templateUrl: "./mant-tutela.component.html",
})
export class MantTutelaComponent implements OnInit {
  ipTutela: IpsTutela = new IpsTutela();
  ipsTutela: IpsTutela[];

  constructor(
    public _usuarioService: UsuarioService,
    private _tutelaService: TutelaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.cargarTablaIpsTutela();
  }

  Guardar(form: NgForm) {
    if (form.valid) {
      this.ipTutela.user = this._usuarioService.id;
      this.ipTutela.fecha = this.datePipe.transform(new Date(), "yyyy-MM-dd");
      this._tutelaService.guardarIp(this.ipTutela).subscribe();
      this.cargarTablaIpsTutela();
      form.reset();
    }
  }

  cargarTablaIpsTutela() {
    this._tutelaService.obtenerIpsTutela().subscribe((resp) => {
      this.ipsTutela = resp;
    });
  }
}
