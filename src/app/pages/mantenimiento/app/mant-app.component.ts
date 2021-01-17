import { Component, OnInit } from "@angular/core";
import { FechaLocalService } from "src/app/services/fechas/fecha-local.service";
import { OpensignalService } from "src/app/services/opensignal/opensignal.service";
import { TutelaService } from "src/app/services/tutela/tutela.service";

@Component({
  selector: "app-mant-app",
  templateUrl: "./mant-app.component.html",
  styleUrls: ["./mant-app.component.css"],
})
export class MantAppComponent implements OnInit {
  desde: any;
  hasta: any;
  showAlertTutela: boolean = false;
  typeAlertTutela: string;
  msgAlertTutela: string;
  titleAlertTutela: string;
  showAlertOpensignal: boolean = false;
  typeAlertOpensignal: string;
  msgAlertOpensignal: string;
  titleAlertOpensignal: string;
  blockBtnTutela: boolean = false;
  blockBtnOpensignal: boolean = false;
  constructor(
    private _fechaService: FechaLocalService,
    private _tutelaService: TutelaService,
    private _opensignalService: OpensignalService
  ) {}

  ngOnInit() {}

  actualizarReporteTutela() {
    this.blockBtnTutela = true;
    const _desde = this._fechaService.corta(0, "yyyy-MM-dd", this.desde);
    const _hasta = this._fechaService.corta(0, "yyyy-MM-dd", this.hasta);
    this._tutelaService
      .actualizarReporteSemanal(_desde, _hasta)
      .subscribe((resp: any) => {
        this.showAlertTutela = true;
        if (resp.ok) {
          this.blockBtnTutela = false;
          this.typeAlertTutela = "success";
          this.titleAlertTutela = "Todo salio bien!!!";
          this.msgAlertTutela =
            "El reporte de Tutela fue actualizado de forma satisfactoria";
        } else {
          this.typeAlertTutela = "warning";
          this.titleAlertTutela = "Ups ocurrio un problema!!!";
          this.msgAlertTutela = resp.message;
        }
      });
  }

  actualizarReporteOpensignal() {
    this.blockBtnOpensignal = true;
    const _desde = this._fechaService.corta(0, "yyyy-MM-dd", this.desde);
    const _hasta = this._fechaService.corta(0, "yyyy-MM-dd", this.hasta);
    this._opensignalService
      .actualizarReporteSemanal(_desde, _hasta)
      .subscribe((resp: any) => {
        this.showAlertOpensignal = true;
        if (resp.ok) {
          this.blockBtnOpensignal = false;
          this.typeAlertOpensignal = "success";
          this.titleAlertOpensignal = "Todo salio bien!!!";
          this.msgAlertOpensignal =
            "El reporte de Opensignal fue actualizado de forma satisfactoria";
        } else {
          this.typeAlertOpensignal = "warning";
          this.titleAlertOpensignal = "Ups ocurrio un problema!!!";
          this.msgAlertOpensignal = resp.message;
        }
      });
  }
}
