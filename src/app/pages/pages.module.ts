import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
//modulos
import { SharedModule } from "../shared/shared.module";

//rutas
import { PAGES_ROUTES } from "./pages.routes";

//componentes
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";

@NgModule({
  declarations: [AmazonComponent, PagesComponent],
  imports: [CommonModule, SharedModule, PAGES_ROUTES],
})
export class PagesModule {}
