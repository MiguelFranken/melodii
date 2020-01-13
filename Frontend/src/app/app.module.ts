import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrototypeModule } from "./prototype/prototype.module";
import { GeneratorModule } from './generator/generator.module';
import { ArcModule } from './arc/arc.module';
import { BoxModule } from './box/box.module';
import { MatModule } from './mat/mat.module';
import { ExperimentsModule } from './experiments/experiments.module';
import { MixerModule } from './mixer/mixer.module';
import { AdvancedSettingsComponent } from './advanced-settings/advanced-settings.component';
import { FormsModule } from "@angular/forms";
import { ContextComponent } from './context/context.component';

@NgModule({
  declarations: [
    AppComponent,
    AdvancedSettingsComponent,
    ContextComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    DashboardModule,
    PrototypeModule,
    GeneratorModule,
    MixerModule,
    ArcModule,
    BoxModule,
    MatModule,
    ExperimentsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
