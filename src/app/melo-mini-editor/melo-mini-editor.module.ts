import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorContainerComponent } from './editor-container/editor-container.component';
import { ToolsModule } from './tools/tools.module';
import { EditorMenuComponent } from './editor-menu/editor-menu.component';
import { MentionModule } from 'angular-mentions';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [EditorContainerComponent, EditorMenuComponent],
  imports: [
    CommonModule,
    ToolsModule,
    MentionModule,
    FormsModule
  ],
  exports: [
    EditorContainerComponent,
    EditorMenuComponent
  ]
})
export class MeloMiniEditorModule { }
