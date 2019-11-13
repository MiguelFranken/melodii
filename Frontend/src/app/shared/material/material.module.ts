import { NgModule } from '@angular/core';
import {
  MatProgressBarModule,
  MatToolbarModule
} from '@angular/material';

const modules = [
  MatToolbarModule,
  MatProgressBarModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
