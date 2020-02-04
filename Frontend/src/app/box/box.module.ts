import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxComponent } from './box.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BoxComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class BoxModule { }
