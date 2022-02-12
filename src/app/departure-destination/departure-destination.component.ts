import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MapService} from "../service/map.service";
import {Event} from "@angular/router";

@Component({
  selector: 'app-departure-destination',
  templateUrl: './departure-destination.component.html',
  styleUrls: ['./departure-destination.component.css']
})
export class DepartureDestinationComponent implements OnInit {
  form!: FormGroup;
  @Input() tabIndex!: number;
  @Output() tabModificationEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(private formBuilder: FormBuilder, private mapService: MapService) {

    this.form = this.formBuilder.group({
      departure: new FormControl("", [Validators.required]),
      arrival: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.tabModificationEmitter.emit(this.tabIndex > 0 ? --this.tabIndex : this.tabIndex);
    console.log(this.form.controls['departure'].value);
    console.log(this.form.controls['arrival'].value);
    this.mapService.departure$.next(this.form.controls['departure'].value);
    this.mapService.arrival$.next(this.form.controls['arrival'].value);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset();
  }
}
