import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

//modulos
import { PagesModule } from "./pages/pages.module";
import { ServiceModule } from "./services/service.module";

//Componentes
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./login/register.component";

//rutas
import { APP_ROUTES } from "./app.routes";
import { FechaPipe } from "./pipes/fecha.pipe";

@NgModule({
  declarations: [AppComponent, LoginComponent, FechaPipe, RegisterComponent],
  imports: [BrowserModule, FormsModule, APP_ROUTES, PagesModule, ServiceModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
