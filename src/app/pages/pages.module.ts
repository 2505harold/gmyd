import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
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

@NgModule({
  declarations: [
    AmazonComponent,
    PagesComponent,
    NperfComponent,
    NperfEditarComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PAGES_ROUTES,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
})
export class PagesModule {}
