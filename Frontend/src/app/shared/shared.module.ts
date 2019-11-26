import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from "./layout/layout.module";
import { LongPressDirective } from "./directives/long-press.directive";
import { ToppyModule } from 'toppy';

const modules = [
  MaterialModule,
  LayoutModule,
];

@NgModule({
  declarations: [
    LongPressDirective,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    modules,
    ToppyModule
  ],
  exports: [
    modules,
    FlexLayoutModule,
    LongPressDirective
  ]
})
export class SharedModule { }
