import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from "./layout/layout.module";
import { LongPress } from "./directives/longpress";

let modules = [
  MaterialModule,
  LayoutModule,
];

@NgModule({
  declarations: [
    LongPress,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    modules
  ],
  exports: [
    modules,
    FlexLayoutModule,
    LongPress
  ]
})
export class SharedModule { }
