import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {

  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';
  errorMessage: string = '';
  originalCode: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripData,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Retrieve stashed trip ID
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    this.originalCode = tripCode;

    console.log('EditTrip::ngOnInit');
    console.log('tripCode: ' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTrip(tripCode)
      .subscribe({
        next: (value: Trip) => {
    // Populate the existing record into the form
    this.trip = value;

    this.editForm.patchValue({
      ...value,
      start: value.start
        ? new Date(value.start).toISOString().split('T')[0]
        : ''
    });

  this.message = 'Trip: ' + tripCode + ' retrieved';
  console.log(this.message);
},
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.originalCode, this.editForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.router.navigate(['']);
          },
    error: (error: any) => {
     console.error('Error updating trip:', error);

     if (error.error?.errors?.perPerson?.message) {
    this.errorMessage = error.error.errors.perPerson.message;
      } else if (error.error?.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage =
          'Unable to update trip. Please check the entered information and try again.';
     }

     this.cdr.detectChanges();
    }
        });
    }
  }

  // get the form short name to access the form fields
  get f() {
    return this.editForm.controls;
  }
}