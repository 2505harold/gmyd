import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-ngxcharts-vertical-bar",
  templateUrl: "./ngxcharts-vertical-bar.component.html",
  styleUrls: ["./ngxcharts-vertical-bar.component.css"],
})
export class NgxchartsVerticalBarComponent implements OnInit {
  @Input() results: [] = [];
  @Input() showYAxisLabel: boolean;
  @Input() yAxisLabel: string;
  @Input() showXAxisLabel: boolean;
  @Input() xAxisLabel: string;
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

  constructor() {}

  ngOnInit() {}
}
