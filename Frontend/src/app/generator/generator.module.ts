import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorComponent } from './generator.component';
import { LogComponent } from './log/log.component';
import { SharedModule } from '../shared/shared.module';
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  declarations: [GeneratorComponent, LogComponent],
  exports: [
    GeneratorComponent,
    LogComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    SharedModule,
    FlexModule
  ]
})
export class GeneratorModule { }
