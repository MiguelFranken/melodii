import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PrototypeComponent } from "./prototype/prototype/prototype.component";
import { LogComponent } from './generator/log/log.component';
import { BoxComponent } from './box/box.component';
import { ArcComponent } from './arc/arc.component';
import { MatComponent } from './mat/mat.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'prototype',
    component: PrototypeComponent
  },
  {
    path: 'log',
    component: LogComponent
  },
  {
    path: 'box',
    component: BoxComponent
  },
  {
    path: 'arc',
    component: ArcComponent
  },
  {
    path: 'mat',
    component: MatComponent
  },
  {
    path: '**', redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
