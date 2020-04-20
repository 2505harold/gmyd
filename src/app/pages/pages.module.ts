import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
//modulos
import { SharedModule } from "../shared/shared.module";

//rutas
import { PAGES_ROUTES } from "./pages.routes";

//componentes
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";
import { NperfComponent } from './nperf/nperf.component';

@NgModule({
  declarations: [AmazonComponent, PagesComponent, NperfComponent],
  imports: [CommonModule, SharedModule, PAGES_ROUTES, FormsModule],
})
export class PagesModule {}
