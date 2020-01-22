import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrototypeModule } from "./prototype/prototype.module";
import { GeneratorModule } from './generator/generator.module';
import { CelloModule } from './cello/cello.module';
import { MatModule } from './mat/mat.module';
import { ExperimentsModule } from './experiments/experiments.module';
import { MixerModule } from './mixer/mixer.module';
import { AdvancedSettingsComponent } from './advanced-settings/advanced-settings.component';
import { FormsModule } from "@angular/forms";
import { ContextComponent } from './context/context.component';
import { StartComponent } from './start/start.component';
import { EffectsModule } from './effects/effects.module';

@NgModule({
  declarations: [
    AppComponent,
    AdvancedSettingsComponent,
    ContextComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    EffectsModule,
    PrototypeModule,
    GeneratorModule,
    MixerModule,
    CelloModule,
    MatModule,
    ExperimentsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
