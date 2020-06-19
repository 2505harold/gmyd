import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { OpensignalService } from "src/app/services/opensignal/opensignal.service";
import { IpsOpenSignal } from "src/app/models/ips.opensignal.model";
import { UsuarioService } from "src/app/services/service.index";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-mant-opensignal",
  templateUrl: "./mant-opensignal.component.html",
  styleUrls: ["./mant-opensignal.component.css"],
})
export class MantOpensignalComponent implements OnInit {
  ipOpensignal: IpsOpenSignal = new IpsOpenSignal();
  ipsOpensignal: any[];

  constructor(
    private _opensignalService: OpensignalService,
    public _usuarioService: UsuarioService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.cargarTablaIpsOpenSignal();
  }

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
}
