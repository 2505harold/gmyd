import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
//modulos
import { SharedModule } from "../shared/shared.module";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "../material/material.module";

//rutas
import { PAGES_ROUTES } from "./pages.routes";

//componentes
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";
import { NperfComponent } from "./nperf/movil/nperf.component";
import { NperfEditarComponent } from "./nperf/editar-puntuacion/nperf-editar.component";
import { GraficoLineasNgxchartsComponent } from "../components/grafico-lineas-ngxcharts/grafico-lineas-ngxcharts.component";
import { GraficoLineasNgxchartsDefaultComponent } from "../components/grafico-lineas-ngxcharts-default/grafico-lineas-ngxcharts-default.component";
import { NgxchartsGroupBarHorizontalComponent } from "../components/ngxcharts-group-bar-horizontal/ngxcharts-group-bar-horizontal.component";
import { NgxchartsStackedBarVerticalComponent } from "../components/ngxcharts-stacked-bar-vertical/ngxcharts-stacked-bar-vertical.component";
import { NgxchartsVerticalBarComponent } from "../components/ngxcharts-vertical-bar/ngxcharts-vertical-bar.component";
import { BoxloadComponent } from "../components/boxload/boxload.component";
import { AlertComponent } from "../components/alert/alert.component";
import { FijoComponent } from "./nperf/fijo/fijo.component";
import { EditarFijoComponent } from "./nperf/editar-fijo/editar-fijo.component";
import { DropdownButtonComponent } from "../components/dropdown-button/dropdown-button.component";
import { ModalComponent } from "../components/modal/modal.component";
import { MantUsuariosComponent } from "./mantenimiento/usuarios/mant-usuarios.component";
import { MantenimientoComponent } from "./mantenimiento/amazon/mantenimiento.component";
import { TutelaComponent } from "./tutela/tutela.component";
import { MantTutelaComponent } from "./mantenimiento/tutela/mant-tutela.component";
import { OpensignalComponent } from "./opensignal/opensignal.component";
import { MantOpensignalComponent } from "./mantenimiento/opensignal/mant-opensignal.component";
import { TestvelocidadComponent } from "./nperf/editar-test-velocidad/testvelocidad.component";
import { TableloadComponent } from "../components/tableload/tableload.component";
import { MantAppComponent } from "./mantenimiento/app/mant-app.component";
import { AgmCoreModule } from "@agm/core";

@NgModule({
  declarations: [
    AmazonComponent,
    PagesComponent,
    NperfComponent,
    NperfEditarComponent,
    MantenimientoComponent,
    GraficoLineasNgxchartsComponent,
    GraficoLineasNgxchartsDefaultComponent,
    NgxchartsGroupBarHorizontalComponent,
    NgxchartsStackedBarVerticalComponent,
    NgxchartsVerticalBarComponent,
    AlertComponent,
    BoxloadComponent,
    TableloadComponent,
    ModalComponent,
    DropdownButtonComponent,
    TestvelocidadComponent,
    FijoComponent,
    EditarFijoComponent,
    MantUsuariosComponent,
    TutelaComponent,
    MantTutelaComponent,
    OpensignalComponent,
    MantOpensignalComponent,
    MantAppComponent,
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
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAfFtYTy-Tw21XXUoCXh3F57K86Bc86GAs",
    }),
  ],
})
export class PagesModule {}
