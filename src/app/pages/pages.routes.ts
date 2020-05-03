import { Routes, RouterModule } from "@angular/router";
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";
import { NperfComponent } from "./nperf/nperf.component";
import { NperfEditarComponent } from "./nperf/nperf-editar.component";
import { LoginGuard } from "../services/service.index";
import { MantenimientoComponent } from "./mantenimiento/mantenimiento.component";
import { TestvelocidadComponent } from "./nperf/testvelocidad/testvelocidad.component";
import { FijoComponent } from "./nperf/fijo/fijo.component";
import { EditarFijoComponent } from "./nperf/editar-fijo/editar-fijo.component";

const pagesRoute: Routes = [
  {
    path: "",
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
      { path: "amazon", component: AmazonComponent },
      { path: "mantenimiento", component: MantenimientoComponent },
      { path: "nperf/movil", component: NperfComponent },
      { path: "nperf/fijo", component: FijoComponent },
      { path: "nperf/fijo/:id", component: EditarFijoComponent },
      { path: "nperf/:id", component: NperfEditarComponent },
      { path: "nperf/velocidad/:id", component: TestvelocidadComponent },
      { path: "", redirectTo: "nperf", pathMatch: "full" },
    ],
  },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoute);
