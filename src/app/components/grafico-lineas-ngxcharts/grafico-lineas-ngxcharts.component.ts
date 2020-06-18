import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-grafico-lineas-ngxcharts",
  templateUrl: "./grafico-lineas-ngxcharts.component.html",
  styleUrls: ["./grafico-lineas-ngxcharts.component.css"],
})
export class GraficoLineasNgxchartsComponent implements OnInit {
  @Input() results: [] = [];
  @Input() showYAxisLabel: boolean;
  @Input() yAxisLabel: boolean;

  datos = [];
  view: any[];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  //showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = "Fecha";
  //yAxisLabel: string = "Puntos";
  timeline: boolean = false;

  colorScheme = {
    domain: ["#dc3545", "#007bff", "#28a745", "#ffc107", "#a8385d", "#aae3f5"],
  };

  constructor() {}

  ngOnInit() {}

  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
}
