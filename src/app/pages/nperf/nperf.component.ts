import { Component, OnInit, AfterViewInit } from "@angular/core";
import { NperfService } from "src/app/services/service.index";
import { isNgTemplate } from "@angular/compiler";
import { ObjectUnsubscribedError } from "rxjs";

@Component({
  selector: "app-nperf",
  templateUrl: "./nperf.component.html",
  styles: [],
})
export class NperfComponent implements OnInit {
  public puntajes: Array<object> = [];
  public labels: any;

  datos = [];
  view: any[];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = "Fecha";
  yAxisLabel: string = "Puntos";
  timeline: boolean = false;

  colorScheme = {
    domain: ["#dc3545", "#007bff", "#28a745", "#ffc107", "#a8385d", "#aae3f5"],
  };

  constructor(private _nperfService: NperfService) {}

  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  ngOnInit() {
    this.loadDatosChart();
  }

  loadDatosChart() {
    const operadores = ["claro", "entel", "movistar", "bitel"];
    this._nperfService.obtenerMetricas().subscribe((resp: any) => {
      this.puntajes = resp.metricas;
      var datos = [];
      operadores.forEach((operador) => {
        var series = [];
        resp.metricas.forEach((objeto) => {
          series.push({
            name: new Date(objeto.fecha_ingreso),
            value: objeto[operador],
          });
        });
        datos.push({ name: operador, series: series });
      });

      this.datos = datos;
    });
  }
}
