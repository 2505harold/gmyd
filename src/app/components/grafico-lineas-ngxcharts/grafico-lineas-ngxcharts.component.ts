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
  @Input() colorScheme: Object;

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
  //colorScheme: Object;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.colorScheme)
      this.colorScheme = {
        domain: this.colorScheme.toString().split(","),
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

    //this.colorScheme = { domain: colorSchema.split(",") };
    // console.log(this.router.url);
    // switch (this.router.url) {
    //   case "/tutela":
    //     this.colorScheme = {
    //       domain: ["#FF4560", "#00E396"],
    //     };
    //     break;
    //   case "/opensignal":
    //     this.colorScheme = {
    //       domain: ["#FF4560", "#00E396"],
    //     };
    //     break;
    //   default:
    //     this.colorScheme = {
    //       domain: [
    //         "#ffc107",
    //         "#dc3545",
    //         "#007bff",
    //         "#28a745",
    //         "#a8385d",
    //         "#aae3f5",
    //       ],
    //     };
    // }
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
