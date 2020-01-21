import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SocketService } from '../shared/socket/socket.service';
import { SharedModule } from '../shared/shared.module';
import { ArcDashboardComponent } from './arc/arc-dashboard.component';
import { BoxDashboardComponent } from './box/box-dashboard.component';
import { MatDashboardComponent } from './mat/mat-dashboard.component';
import { VolumeComponent } from './volume/volume.component';
import { DashboardEffectButtonsComponent } from './dashboard-effect-buttons/dashboard-effect-buttons.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ArcDashboardComponent,
    BoxDashboardComponent,
    MatDashboardComponent,
    VolumeComponent,
    DashboardEffectButtonsComponent,
  ],
  exports: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [
    SocketService
  ]
})
export class DashboardModule { }
