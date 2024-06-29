import { NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputValidator } from '../model';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements OnInit, OnDestroy, OnChanges {

  @Input({ required: true }) type: string = "text";
  @Input() class: string = "";
  @Input({ required: true }) name: string = "";
  @Input() label?: string
  @Input() validators: InputValidator[] = [];
  @Input() placeholder: string = ""
  @Input() editable: boolean = true;

  @Input({ required: true }) value: string = "";
  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() valid: EventEmitter<boolean> = new EventEmitter();
  @Output() keyPress: EventEmitter<Event> = new EventEmitter()



  control?: FormControl;
  currentError: string | null = null;
  private subsriptionChanges?: Subscription;


  ngOnChanges(changes: SimpleChanges): void {

    const { value } = changes;

    if (value) {
      this.control?.setValue(value.currentValue)
    }

  }

  ngOnInit(): void {


    this.control = new FormControl(this.value, this.validators.map(validator => validator.validator));
    if (!this.editable) {
      this.control.disable()
      return;
    }
    this.subsriptionChanges = this.control.valueChanges.subscribe({
      next: (value) => {
        const isValid = this.control!.valid;
        this.valid.emit(isValid)
        if (isValid) {
          this.currentError = null;
          this.valueChange.emit(value)
        } else {
          let error;
          for (const { onError } of this.validators) {
            error = onError(this.control?.errors)
            if (!!error) {
              this.currentError = error;
              break;
            }
          }
        }



      }
    })
  }

  ngOnDestroy(): void {
    this.subsriptionChanges?.unsubscribe()
  }




}
