import { NgModule } from '@angular/core';
import {
  MatFormFieldModule, MatInputModule,
  MatProgressBarModule, MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";

const modules = [
  MatToolbarModule,
  MatProgressBarModule,
  MatSliderModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatMenuModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
