import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {


  @Input() loader: boolean = false;
  @Input() type: "submit" | "button" = "button"
  @Input() class: string = "";
  @Input({ required: true }) text: string = "";
  @Input() isClicked: boolean = false;
  @Input() enabled: boolean = true;
  @Output() isClickedChange: EventEmitter<boolean> = new EventEmitter();



  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter();

  handleClick(event: MouseEvent) {
    this.isClicked = true;
    this.clicked.emit(event)
  }


}
