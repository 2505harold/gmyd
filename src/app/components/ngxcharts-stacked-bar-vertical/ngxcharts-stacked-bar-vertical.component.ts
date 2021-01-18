import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-ngxcharts-stacked-bar-vertical",
  templateUrl: "./ngxcharts-stacked-bar-vertical.component.html",
  styleUrls: ["./ngxcharts-stacked-bar-vertical.component.css"],
})
export class NgxchartsStackedBarVerticalComponent implements OnInit {
  view: any[] = [700, 400];
  @Input() results: [] = [];
  @Input() yAxisLabel: string;
  @Input() showYAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() showXAxisLabel: boolean;
  @Input() height: number;

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  animations: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;

  customColors = (value) => {
    switch (value) {
      case "Claro":
        return "#dc3545";
      case "Entel":
        return "#007bff";
      case "Movistar":
        return "#28a745";
      case "Bitel":
        return "#ffc107";
      default:
        return "#dc3545";
    }
  };

  constructor() {}

  ngOnInit() {}
}
