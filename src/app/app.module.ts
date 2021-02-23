import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MinieditorVcModule} from 'minieditor-vc';
import { MeloMiniEditorModule } from './melo-mini-editor/melo-mini-editor.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MinieditorVcModule,
    MeloMiniEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
