import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { PcsAmazon } from "src/app/models/pcs-amazon.model";
import { NgForm } from "@angular/forms";
import { AmazonService, UsuarioService } from "src/app/services/service.index";
import { ModalService } from "src/app/components/modal/modal.service";
import { LinksInternacionales } from "src/app/models/links-internacional.model";
import { InternacionalService } from "src/app/services/internacional.service";
import Swal from "sweetalert2";
import { IpsAmazon } from "src/app/models/ips.amazon.model";

@Component({
  selector: "app-mantenimiento",
  templateUrl: "./mantenimiento.component.html",
  styleUrls: [],
})
export class MantenimientoComponent implements OnInit {
  carga: boolean = true;
  loadTblPing: boolean = true;
  //link: LinksInternacionales = new LinksInternacionales();
  pc: PcsAmazon = new PcsAmazon();
  prefijo: IpsAmazon = new IpsAmazon();
  links: LinksInternacionales[] = [];
  prefijos: any[];
  numPingGuardados: any[] = [];
  metricas: any[] = [];
  dias: number;
  pcs: PcsAmazon[] = [];
  cargaPrefijos: boolean = true;
  desde: number = 0;
  totalRegistro: number;
  actualizandoPrefijos: boolean = false;
  @ViewChild("input", { static: false }) input: ElementRef;
  displayedColumns: string[] = ["index", "_id", "cantidad", "accion"];
  diasPing: number;

  constructor(
    private _amazonService: AmazonService,
    public _modalService: ModalService,
    public _internacionalService: InternacionalService,
    public _usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.llenarTablaPcs();
    this.llenarTablaEnlacesInternacionales();
    this._modalService.notificacion.subscribe(() => {
      this.llenarTablaEnlacesInternacionales();
    });
    this.llenarTablaPrefijos("todo", 0);
    this.llenarTablaMetricasDelayByDias();
    this.cargarTablaNumeroPingGuardados();
  }

  //************************************************************** */
  //Metodos del TAB PCS AMAZON
  //************************************************************** */

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

  //************************************************************** */
  //Metodos del TAB ENLACES INTERNACIONALES
  //************************************************************** */

  llenarTablaEnlacesInternacionales() {
    this._internacionalService.obtenerLink().subscribe((resp) => {
      this.links = resp;
    });
  }
  agregarLinkIntern() {
    this._modalService.mostrarModal();
  }

  actualizarLink(link: any) {
    this._internacionalService
      .actualizarLink(link._id, link)
      .subscribe((resp) => {
        this.llenarTablaEnlacesInternacionales();
      });
  }
  eliminarLink(link: any) {
    Swal.fire({
      title: "Estas seguro?",
      text: "Usted no podra revertir este cambio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrarlo",
    }).then((result) => {
      if (result.value) {
        this._internacionalService.eliminarLink(link._id).subscribe((resp) => {
          Swal.fire(
            "Eliminado!",
            "El equipo " +
              link.equipo +
              " con proveedor " +
              link.proveedor +
              " fue eliminado",
            "success"
          );
          this.llenarTablaEnlacesInternacionales();
        });
      }
    });
  }

  //************************************************************** */
  //Metodos del TAB PREFIJOS DELAY AMAZON
  //************************************************************** */

  //actualizar prefijos de amazon
  prefixAmazon() {
    this.actualizandoPrefijos = true;
    this._amazonService.cargarPrefixAmazon().subscribe((resp) => {
      this.actualizandoPrefijos = false;
    });
  }
  //actualizar regiones de amazon
  regionAmazon() {
    this._amazonService.cargarRegionesAmazon().subscribe();
  }

  llenarTablaPrefijos(buscar: string, desde?: number) {
    this.cargaPrefijos = true;
    this._amazonService
      .obtenerPrefixAmazon(buscar, desde, 100)
      .subscribe((resp) => {
        this.prefijos = resp.ipsamazon;
        this.cargaPrefijos = false;
        this.totalRegistro = resp.total;
      });
  }

  equipoSeleccionado(prefijo: IpsAmazon, equipo: string) {
    prefijo.link_internacional = equipo;
    this._amazonService
      .actualizarEquipoPrefijosAmazon(prefijo)
      .subscribe((resp) => {
        let termino = this.input.nativeElement.value;
        termino === ""
          ? this.llenarTablaPrefijos("todo", this.desde)
          : this.llenarTablaPrefijos(termino, this.desde);
      });
  }

  continuar(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistro) {
      return;
    }
    if (desde < 0) {
      return;
    }

    this.desde += valor;
    let termino = this.input.nativeElement.value;
    termino === ""
      ? this.llenarTablaPrefijos("todo", desde)
      : this.llenarTablaPrefijos(termino, desde);
  }

  buscarPrefijo(termino: string) {
    this.llenarTablaPrefijos(termino, 0);
  }

  //************************************************************** */
  //Metodos del TAB CONTROL DE FECHA GUARDADAS
  //************************************************************** */

  llenarTablaMetricasDelayByDias() {
    this._amazonService
      .obtenerAgrupadoMetricasDelayByDias()
      .subscribe((resp: any) => {
        this.dias = resp.dias;
        this.metricas = resp.metricas;
      });
  }

  eliminarFecha(item) {
    Swal.fire({
      title: "Estas seguro?",
      text: "Usted no podra revertir este cambio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrarlo",
    }).then((result) => {
      if (result.value) {
        this._amazonService
          .eliminarMetricaDelayByFecha(item._id)
          .subscribe((resp) => {
            this.llenarTablaMetricasDelayByDias();
          });
      }
    });
  }

  //************************************************************** */
  //Metodos del TAB NUMERO DE PING GUARDADOS
  //************************************************************** */
  cargarTablaNumeroPingGuardados() {
    this._amazonService
      .obtenerCantidadPruebasPingPorDias()
      .subscribe((resp: any) => {
        this.diasPing = resp.dias;
        this.numPingGuardados = resp.metricas;
        this.loadTblPing = false;
      });
  }

  eliminarPingPorFecha(item) {
    Swal.fire({
      title: "Estas seguro?",
      text: "Usted no podra revertir este cambio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrarlo",
    }).then((result) => {
      if (result.value) {
        this.loadTblPing = true;
        this._amazonService
          .eliminarMetricasPingPorFecha(item._id)
          .subscribe((resp) => {
            this.cargarTablaNumeroPingGuardados();
            this.loadTblPing = false;
          });
      }
    });
  }
}
