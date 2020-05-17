import { Component, OnInit, Input } from "@angular/core";
import { ModalService } from "./modal.service";
import { NgForm } from "@angular/forms";
import { InternacionalService } from "src/app/services/internacional.service";
import { LinksInternacionales } from "src/app/models/links-internacional.model";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent implements OnInit {
  @Input() placeholders;
  link: LinksInternacionales = new LinksInternacionales();

  constructor(
    public _modalService: ModalService,
    private _internacionalService: InternacionalService
  ) {}

  ngOnInit() {}

  guardar(form: NgForm) {
    this._internacionalService.guardarLink(form.value).subscribe((resp) => {
      this._modalService.notificacion.emit(resp);
    });
    form.reset();
    this._modalService.ocultarModal();
  }
}
