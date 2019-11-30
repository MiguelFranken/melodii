import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterComponent } from './meter/meter.component';
import { ExperimentsComponent } from './experiments.component';
import { SharedModule } from '../shared/shared.module';
import { FlexModule } from '@angular/flex-layout';
import { ExperimentsRoutingModule } from './experiments-routing.module';
import { FrequencyComponent } from './frequency/frequency.component';



@NgModule({
  declarations: [MeterComponent, ExperimentsComponent, FrequencyComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlexModule,
    ExperimentsRoutingModule
  ],
})
export class ExperimentsModule { }
