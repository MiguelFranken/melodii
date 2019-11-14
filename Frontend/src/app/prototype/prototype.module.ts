import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrototypeComponent } from './prototype/prototype.component';
import { FlexModule } from "@angular/flex-layout";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";



@NgModule({
  declarations: [PrototypeComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlexModule
  ]
})
export class PrototypeModule { }
