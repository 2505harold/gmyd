import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { MantenimientoComponent } from "./mantenimiento/mantenimiento.component";
import { GraficoLineasNgxchartsComponent } from "../components/grafico-lineas-ngxcharts/grafico-lineas-ngxcharts.component";
import { TestvelocidadComponent } from './nperf/testvelocidad/testvelocidad.component';

@NgModule({
  declarations: [
    AmazonComponent,
    PagesComponent,
    NperfComponent,
    NperfEditarComponent,
    MantenimientoComponent,
    GraficoLineasNgxchartsComponent,
    TestvelocidadComponent,
  ],
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
