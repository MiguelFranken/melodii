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

@NgModule({
  declarations: [
    AppComponent
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
    ExperimentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
