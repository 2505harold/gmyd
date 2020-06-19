import { Routes, RouterModule } from "@angular/router";
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";
import { NperfComponent } from "./nperf/nperf.component";
import { NperfEditarComponent } from "./nperf/nperf-editar.component";
import { LoginGuard } from "../services/service.index";
import { TestvelocidadComponent } from "./nperf/testvelocidad/testvelocidad.component";
import { FijoComponent } from "./nperf/fijo/fijo.component";
import { EditarFijoComponent } from "./nperf/editar-fijo/editar-fijo.component";
import { MantUsuariosComponent } from "./mantenimiento/usuarios/mant-usuarios.component";
import { MantenimientoComponent } from "./mantenimiento/amazon/mantenimiento.component";
import { TutelaComponent } from "./tutela/tutela.component";
import { MantTutelaComponent } from "./mantenimiento/tutela/mant-tutela.component";
import { OpensignalComponent } from "./opensignal/opensignal.component";
import { MantOpensignalComponent } from "./mantenimiento/opensignal/mant-opensignal.component";

const pagesRoute: Routes = [
  {
    path: "",
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
      { path: "amazon", component: AmazonComponent },
      { path: "tutela", component: TutelaComponent },
      { path: "opensignal", component: OpensignalComponent },
      { path: "mantenimiento/amazon", component: MantenimientoComponent },
      { path: "mantenimiento/usuarios", component: MantUsuariosComponent },
      { path: "mantenimiento/tutela", component: MantTutelaComponent },
      { path: "mantenimiento/opensignal", component: MantOpensignalComponent },
      { path: "nperf/movil", component: NperfComponent },
      { path: "nperf/fijo", component: FijoComponent },
      { path: "nperf/fijo/:id/:area", component: EditarFijoComponent },
      { path: "nperf/:id", component: NperfEditarComponent },
      { path: "nperf/velocidad/:id", component: TestvelocidadComponent },
      { path: "", redirectTo: "nperf/movil", pathMatch: "full" },
    ],
  },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoute);
