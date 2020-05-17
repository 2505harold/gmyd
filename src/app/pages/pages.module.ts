import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
//modulos
import { SharedModule } from "../shared/shared.module";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

//rutas
import { PAGES_ROUTES } from "./pages.routes";

//componentes
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";
import { NperfComponent } from "./nperf/nperf.component";
import { NperfEditarComponent } from "./nperf/nperf-editar.component";
import { GraficoLineasNgxchartsComponent } from "../components/grafico-lineas-ngxcharts/grafico-lineas-ngxcharts.component";
import { TestvelocidadComponent } from "./nperf/testvelocidad/testvelocidad.component";
import { FijoComponent } from "./nperf/fijo/fijo.component";
import { EditarFijoComponent } from "./nperf/editar-fijo/editar-fijo.component";
import { DropdownButtonComponent } from "../components/dropdown-button/dropdown-button.component";
import { ModalComponent } from "../components/modal/modal.component";
import { MantUsuariosComponent } from "./mantenimiento/usuarios/mant-usuarios.component";
import { MantenimientoComponent } from "./mantenimiento/amazon/mantenimiento.component";

@NgModule({
  declarations: [
    AmazonComponent,
    PagesComponent,
    NperfComponent,
    NperfEditarComponent,
    MantenimientoComponent,
    GraficoLineasNgxchartsComponent,
    ModalComponent,
    DropdownButtonComponent,
    TestvelocidadComponent,
    FijoComponent,
    EditarFijoComponent,
    MantUsuariosComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    SharedModule,
    PAGES_ROUTES,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
})
export class PagesModule {}
