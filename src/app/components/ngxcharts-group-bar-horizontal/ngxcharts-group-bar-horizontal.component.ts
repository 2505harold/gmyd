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

  colorScheme = {
    domain: [
      "#FF4560",
      "#00E396",
      "#008FFB",
      "#775DD0",
      "#FEB019",
      "#00695C",
      "#3F729B",
      "#007E33",
      "#3E4551",
      "#17A2B8",
      "#FF80AB",
      "#90CAF9",
      "#CC0000",
      "#00FFFF",
      "#FF1493",
      "#00FF00",
      "#808000",
    ],
  };
  //schemeType: string = "linear";

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
