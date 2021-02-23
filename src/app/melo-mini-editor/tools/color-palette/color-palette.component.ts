import { Component, Output, EventEmitter, Input } from '@angular/core';
@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.less'],
})
export class ColorPaletteComponent {
  @Input() color: string;
  @Output() colorChange: EventEmitter<string> = new EventEmitter();
  constructor() {  }

  change(event: string): void {
    this.colorChange.emit(event);
  }
}
