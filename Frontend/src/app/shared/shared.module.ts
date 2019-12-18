import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from "./layout/layout.module";
import { LongPressDirective } from "./directives/long-press.directive";
import { ToppyModule } from 'toppy';
import { HelpOverlayComponent } from './help-overlay/help-overlay.component';
import { SafeHTMLPipe } from './pipes/safe-html.pipe';

const modules = [
  MaterialModule,
  LayoutModule,
];

@NgModule({
  declarations: [
    LongPressDirective,
    HelpOverlayComponent,
    SafeHTMLPipe
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    modules,
    ToppyModule
  ],
  exports: [
    modules,
    FlexLayoutModule,
    SafeHTMLPipe,
    LongPressDirective
  ],
  entryComponents: [
    HelpOverlayComponent
  ]
})
export class SharedModule { }
