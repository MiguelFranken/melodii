import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrototypeComponent } from "./prototype/prototype/prototype.component";
import { LogComponent } from './generator/log/log.component';
import { CelloComponent } from './cello/cello.component';
import { MatComponent } from './mat/mat.component';
import { MixerComponent } from './mixer/mixer.component';
import { AdvancedSettingsComponent } from "./advanced-settings/advanced-settings.component";
import { ContextComponent } from "./context/context.component";
import { EffectsComponent } from './effects/effects.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {
    path: '',
    component: StartComponent,
  },
  {
    path: 'effects',
    component: EffectsComponent
  },
  {
    path: 'prototype',
    component: PrototypeComponent,
  },
  {
    path: 'context',
    component: ContextComponent,
  },
  {
    path: 'advanced-settings',
    component: AdvancedSettingsComponent,
  },
  {
    path: 'log',
    component: LogComponent,
  },
  {
    path: 'arc',
    component: CelloComponent,
  },
  {
    path: 'mixer',
    component: MixerComponent,
  },
  {
    path: 'mat',
    component: MatComponent,
  },
  {
    path: 'experiments',
    loadChildren: './experiments/experiments.module#ExperimentsModule',
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
