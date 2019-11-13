import { NgModule } from '@angular/core';
import {
  MatProgressBarModule,
  MatToolbarModule
} from '@angular/material';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

const modules = [
  MatToolbarModule,
  MatProgressBarModule,
  MatIconModule,
  MatButtonModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
