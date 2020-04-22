import { Component, OnInit } from "@angular/core";
import { NperfMeter } from "src/app/models/nperf.meter.model";
import { NgForm } from "@angular/forms";
import { NperfService } from "src/app/services/service.index";

@Component({
  selector: "app-nperf-editar",
  templateUrl: "./nperf-editar.component.html",
  styles: [],
})
export class NperfEditarComponent implements OnInit {
  metricas: NperfMeter = new NperfMeter(
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  );

  constructor(public _nperfService: NperfService) {}

  ngOnInit() {}

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    form.value.usuario = localStorage.getItem("id");
    this._nperfService.guardarMetricas(form.value).subscribe();
    form.reset();
  }
}
