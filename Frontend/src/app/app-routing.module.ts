import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PrototypeComponent } from "./prototype/prototype/prototype.component";

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
    path: '**', redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
