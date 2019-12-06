import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MixerComponent } from './mixer.component';
import { SharedModule } from '../shared/shared.module';
import { FlexModule } from '@angular/flex-layout';


@NgModule({
  declarations: [MixerComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlexModule
  ]
})
export class MixerModule { }
