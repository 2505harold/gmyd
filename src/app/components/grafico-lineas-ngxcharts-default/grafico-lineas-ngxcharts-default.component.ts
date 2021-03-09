import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-grafico-lineas-ngxcharts-default",
  templateUrl: "./grafico-lineas-ngxcharts-default.component.html",
  styleUrls: ["./grafico-lineas-ngxcharts-default.component.css"],
})
export class GraficoLineasNgxchartsDefaultComponent implements OnInit {
  @Input() results: [] = [];
  @Input() showYAxisLabel: boolean;
  @Input() yAxisLabel: boolean;
  @Input() showXAxisLabel: boolean;
  @Input() xAxisLabel: boolean;
  @Input() height: number;
  @Input() legend: boolean;

  datos = [];
  view: any[];

  colorScheme = {
    domain: [
      "#FF4560",
      "#775DD0",
      "#008FFB",
      "#00E396",
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
      "#ff6090",
      "#7c4dff",
      "#FF7F50",
      "#9FE2BF",
      "#CCCCFF",
      "#DFFF00",
    ],
  };

  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = false;

  constructor() {}

  ngOnInit() {}
}
