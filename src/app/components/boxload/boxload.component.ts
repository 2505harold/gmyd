import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-boxload",
  templateUrl: "./boxload.component.html",
  styleUrls: ["./boxload.component.css"],
})
export class BoxloadComponent implements OnInit {
  @Input() show: boolean;
  constructor() {}

  ngOnInit() {}
}
