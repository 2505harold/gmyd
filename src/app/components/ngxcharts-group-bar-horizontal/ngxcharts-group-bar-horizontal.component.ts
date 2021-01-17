import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-ngxcharts-group-bar-horizontal",
  templateUrl: "./ngxcharts-group-bar-horizontal.component.html",
  styleUrls: ["./ngxcharts-group-bar-horizontal.component.css"],
})
export class NgxchartsGroupBarHorizontalComponent implements OnInit {
  @Input() results: [] = [];
  @Input() showYAxisLabel: boolean;
  @Input() yAxisLabel: string;
  @Input() showXAxisLabel: boolean;
  @Input() xAxisLabel: string;
  @Input() showDataLabel: boolean;
  @Input() height: number;

  multi: any[];
  view: any[];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: string = "below";

  //schemeType: string = "linear";

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
    }
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
