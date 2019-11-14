import { NgModule } from '@angular/core';
import {
  MatProgressBarModule,
  MatToolbarModule
} from '@angular/material';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";

const modules = [
  MatToolbarModule,
  MatProgressBarModule,
  MatSliderModule,
  MatIconModule,
  MatButtonModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
