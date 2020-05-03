import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-dropdown-button",
  templateUrl: "./dropdown-button.component.html",
  styleUrls: [],
})
export class DropdownButtonComponent implements OnInit {
  @Input() datos: [] = [];
  @Input() valor: string;

  constructor() {}

  ngOnInit() {}
}
