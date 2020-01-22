import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelloComponent } from './cello.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CelloComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CelloModule { }
