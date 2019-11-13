import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from "./layout/layout.module";

let modules = [
  MaterialModule,
  LayoutModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexLayoutModule,
    modules
  ],
  exports: [
    modules,
    FlexLayoutModule
  ]
})
export class SharedModule { }
