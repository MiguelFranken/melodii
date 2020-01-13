import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterComponent } from './meter/meter.component';
import { ExperimentsComponent } from './experiments.component';
import { SharedModule } from '../shared/shared.module';
import { FlexModule } from '@angular/flex-layout';
import { ExperimentsRoutingModule } from './experiments-routing.module';
import { FrequencyComponent } from './frequency/frequency.component';
import { FormsModule } from '@angular/forms';
import { LatencyComponent } from './latency/latency.component';
import { ArcComponent } from './arc/arc.component';
import { BoxComponent } from './box/box.component';
import { MatComponent } from './mat/mat.component';



@NgModule({
  declarations: [MeterComponent, ExperimentsComponent, FrequencyComponent, LatencyComponent, ArcComponent, BoxComponent, MatComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlexModule,
    ExperimentsRoutingModule,
    FormsModule
  ],
})
export class ExperimentsModule { }
