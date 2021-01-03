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
  @Input() colorScheme: Object;

  multi: any[];
  view: any[];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: string = "below";

  //schemeType: string = "linear";

  constructor() {}

  ngOnInit() {
    if (this.colorScheme === "theme-armchart")
      this.colorScheme = {
        domain: [
          "#875692",
          "#F38400",
          "#A1CAF1",
          "#C2B280",
          "#848482",
          "#008856",
        ],
      };
    else
      this.colorScheme = {
        domain: [
          "#ffc107",
          "#dc3545",
          "#007bff",
          "#28a745",
          "#a8385d",
          "#aae3f5",
        ],
      };
  }

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
