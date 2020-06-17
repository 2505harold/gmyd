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
  ipsTutela: IpsTutela = new IpsTutela();

  constructor(
    public _usuarioService: UsuarioService,
    private _tutelaService: TutelaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {}

  Guardar(form: NgForm) {
    if (form.valid) {
      this.ipsTutela.user = this._usuarioService.id;
      this.ipsTutela.fecha = this.datePipe.transform(new Date(), "yyyy-MM-dd");
      this._tutelaService.guardarIp(this.ipsTutela).subscribe();
      form.reset();
    }
  }
}
