import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

//modulos
import { PagesModule } from "./pages/pages.module";
import { ServiceModule } from "./services/service.module";

//Componentes
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";

//rutas
import { APP_ROUTES } from "./app.routes";

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [BrowserModule, FormsModule, APP_ROUTES, PagesModule, ServiceModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
