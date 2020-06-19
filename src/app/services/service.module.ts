import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmazonService } from "./service.index";
import { HttpClientModule } from "@angular/common/http";
import { NperfService } from "./nperf/nperf.service";
import { UsuarioService } from "./usuario/usuario.service";
import { LoginGuard } from "./service.index";
import { ModalService } from "../components/modal/modal.service";
import { InternacionalService } from "./internacional.service";
import { TutelaService } from "./tutela/tutela.service";
import { OpensignalService } from "./opensignal/opensignal.service";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    AmazonService,
    NperfService,
    UsuarioService,
    LoginGuard,
    ModalService,
    InternacionalService,
    TutelaService,
    OpensignalService,
  ],
})
export class ServiceModule {}
