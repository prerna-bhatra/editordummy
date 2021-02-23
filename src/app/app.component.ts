import { Component,OnChanges,SimpleChanges } from '@angular/core';
// ChangeDetectionStrategy
import { EditorConfig } from './melo-mini-editor/editor-config-interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  
  filesFromChild:any=[]
  title = 'minieditor';
  defValue = 'jdi';
  modelvalue1 = '';
  modelvalue2 = '';
  editorConfig1: EditorConfig = {
    mentionedNames: [{ id: 244 , name: 'Alec'}, { id: 560, name: 'Pappu'}, { id: 747, name: 'Joyce'}],
    mentionedDates: ['19-02-2020', '11-02-2020', '12-02-2020', '14-02-2020'],
    toolbarPlacement: 'bottom',
    placeholder: 'Please Add Some Text'
  };

  editorConfig2: EditorConfig = {
    file: true,
    colorPalette: true,
    toolbarPlacement: 'top',
    placeholder: 'Please Add Some Text'
  };
  
  

//from menu to container
filesSaved(event: any) {
  this.filesFromChild = event;
  console.log("APP COMPONENT",this.filesFromChild);
  // this.sendSavedFiles.emit(this.filesFromChild)
  
}

comment(event: string): void {
  console.log('COMMENT');
  console.log(event);
}


  

  hello(): void {
    // console.log('HELLO3');
  }
}
