import { Routes, RouterModule } from "@angular/router";
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";
import { NperfComponent } from "./nperf/movil/nperf.component";
import { NperfEditarComponent } from "./nperf/editar-puntuacion/nperf-editar.component";
import { LoginGuard } from "../services/service.index";
import { FijoComponent } from "./nperf/fijo/fijo.component";
import { EditarFijoComponent } from "./nperf/editar-fijo/editar-fijo.component";
import { MantUsuariosComponent } from "./mantenimiento/usuarios/mant-usuarios.component";
import { MantenimientoComponent } from "./mantenimiento/amazon/mantenimiento.component";
import { TutelaComponent } from "./tutela/tutela.component";
import { MantTutelaComponent } from "./mantenimiento/tutela/mant-tutela.component";
import { OpensignalComponent } from "./opensignal/opensignal.component";
import { MantOpensignalComponent } from "./mantenimiento/opensignal/mant-opensignal.component";
import { TestvelocidadComponent } from "./nperf/editar-test-velocidad/testvelocidad.component";

const pagesRoute: Routes = [
  {
    path: "",
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
      { path: "amazon/:tipo", component: AmazonComponent },
      { path: "tutela/:tipo", component: TutelaComponent },
      { path: "opensignal/:id", component: OpensignalComponent },
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
