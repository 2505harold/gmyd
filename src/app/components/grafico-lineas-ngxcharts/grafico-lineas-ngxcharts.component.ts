import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-grafico-lineas-ngxcharts",
  templateUrl: "./grafico-lineas-ngxcharts.component.html",
  styleUrls: ["./grafico-lineas-ngxcharts.component.css"],
})
export class GraficoLineasNgxchartsComponent implements OnInit {
  @Input() results: [] = [];
  @Input() showYAxisLabel: boolean;
  @Input() yAxisLabel: boolean;
  @Input() height: number;
  @Input() customColor: string;

  datos = [];
  view: any[];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = "Fecha";

  //showYAxisLabel: boolean = false;

  //yAxisLabel: string = "Puntos";

  //colorScheme: Object;

  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
  };

  customColors = (value) => {
    switch (value.toLowerCase()) {
      case "claro":
        return "#dc3545";
      case "entel":
        return "#007bff";
      case "movistar":
        return "#28a745";
      case "bitel":
        return "#ffc107";
      case "south america (são paulo)":
        return "#AA00FF";
      case "us east (n. virginia)":
        return "#C6FF00";
      case "us west (n. california)":
        return "#0097A7";
      case "us east (ohio)":
        return "#FF4081";
    }
  };

  constructor(private router: Router) {}

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
