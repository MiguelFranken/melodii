import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrototypeComponent } from './prototype/prototype.component';
import { FlexModule } from "@angular/flex-layout";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [PrototypeComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlexModule
  ]
})
export class PrototypeModule { }
