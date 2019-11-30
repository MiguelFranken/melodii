import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SocketService } from '../shared/socket/socket.service';
import { SharedModule } from '../shared/shared.module';
import { ArcDashboardComponent } from './arc/arc-dashboard.component';
import { BoxDashboardComponent } from './box/box-dashboard.component';
import { MatDashboardComponent } from './mat/mat-dashboard.component';
import { AudioContextModule } from 'angular-audio-context';

@NgModule({
  declarations: [
    DashboardComponent,
    ArcDashboardComponent,
    BoxDashboardComponent,
    MatDashboardComponent,
  ],
  exports: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AudioContextModule.forChild()
  ],
  providers: [
    SocketService,
    AudioContext
  ]
})
export class DashboardModule { }
