import { ExperimentsComponent } from './experiments.component';
import { MeterComponent } from './meter/meter.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FrequencyComponent } from './frequency/frequency.component';
import { LatencyComponent } from './latency/latency.component';
import { ArcComponent } from './arc/arc.component';
import { BoxComponent } from './box/box.component';

const routes = [
  {
    path: '',
    component: ExperimentsComponent,
    children: [
      {
        path: 'meter',
        component: MeterComponent,
        pathMatch: 'full'
      },
      {
        path: 'latency',
        component: LatencyComponent,
        pathMatch: 'full'
      },
      {
        path: 'frequency',
        component: FrequencyComponent,
        pathMatch: 'full'
      },
      {
        path: 'arc',
        component: ArcComponent,
        pathMatch: 'full'
      },
      {
        path: 'box',
        component: BoxComponent,
        pathMatch: 'full'
      },
      {
        path: '', redirectTo: 'meter', pathMatch: 'full'
      },
      {
        path: '**',
        component: MeterComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExperimentsRoutingModule { }
