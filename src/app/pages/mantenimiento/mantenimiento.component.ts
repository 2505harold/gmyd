import { Component, OnInit } from "@angular/core";
import { PcsAmazon } from "src/app/models/pcs-amazon.model";
import { NgForm } from "@angular/forms";
import { AmazonService } from "src/app/services/service.index";

@Component({
  selector: "app-mantenimiento",
  templateUrl: "./mantenimiento.component.html",
  styleUrls: [],
})
export class MantenimientoComponent implements OnInit {
  pc: PcsAmazon = new PcsAmazon();
  pcs: PcsAmazon[] = [];

  constructor(private _amazonService: AmazonService) {}

  ngOnInit() {
    this.llenarTablaPcs();
  }

  llenarTablaPcs() {
    this._amazonService.obtenerPcs().subscribe((resp) => {
      this.pcs = resp;
    });
  }

  Guardar(form: NgForm) {
    this._amazonService.guardarPc(form.value).subscribe((resp) => {
      this.llenarTablaPcs();
      form.reset();
    });
  }
}
