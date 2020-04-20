import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AmazonService } from "./service.index";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [AmazonService],
})
export class ServiceModule {}
