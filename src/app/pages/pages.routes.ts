import { Routes, RouterModule } from "@angular/router";
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";
import { NperfComponent } from "./nperf/nperf.component";
import { NperfEditarComponent } from "./nperf/nperf-editar.component";
import { LoginGuard } from "../guards/login.guard";

const pagesRoute: Routes = [
  {
    path: "",
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
      { path: "amazon", component: AmazonComponent },
      { path: "nperf", component: NperfComponent },
      { path: "nperf/:id", component: NperfEditarComponent },
    ],
  },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoute);
