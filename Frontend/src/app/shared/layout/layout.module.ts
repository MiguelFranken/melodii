import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material/material.module";
import { FlexModule } from "@angular/flex-layout";

@NgModule({
  declarations: [
    NavigationComponent
  ],
  exports: [
    NavigationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexModule
  ]
})
export class LayoutModule { }
