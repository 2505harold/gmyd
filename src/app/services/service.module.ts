import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmazonService } from "./service.index";
import { HttpClientModule } from "@angular/common/http";
import { NperfService } from "./nperf/nperf.service";
import { UsuarioService } from "./usuario/usuario.service";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [AmazonService, NperfService, UsuarioService],
})
export class ServiceModule {}
