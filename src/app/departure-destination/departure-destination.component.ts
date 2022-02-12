import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-departure-destination',
  templateUrl: './departure-destination.component.html',
  styleUrls: ['./departure-destination.component.css']
})
export class DepartureDestinationComponent implements OnInit {
  form!: FormGroup;
  @Input() tabIndex!: number;
  @Output() tabModificationEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(private formBuilder: FormBuilder) {

    this.form = this.formBuilder.group({
      departure: new FormControl("", [Validators.required]),
      arrival: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  onSubmit($event: MouseEvent) {
    this.tabModificationEmitter.emit(this.tabIndex > 0 ? --this.tabIndex : this.tabIndex);

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset();
  }
}
