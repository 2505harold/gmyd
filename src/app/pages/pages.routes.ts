import { Routes, RouterModule } from "@angular/router";
import { AmazonComponent } from "./amazon/amazon.component";
import { PagesComponent } from "./pages.component";

const pagesRoute: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [{ path: "amazon", component: AmazonComponent }],
  },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoute);
