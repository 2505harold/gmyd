import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-tableload",
  templateUrl: "./tableload.component.html",
  styleUrls: ["./tableload.component.css"],
})
export class TableloadComponent implements OnInit {
  @Input() show: boolean;
  constructor() {}

  ngOnInit() {}
}
