import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})
export class AddTrip implements OnInit {
  public addForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripData,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.addForm.valid) {
      this.tripService.addTrip(this.addForm.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.error('Error adding trip:', error);

            if (error.error?.errors?.perPerson?.message) {
              this.errorMessage = error.error.errors.perPerson.message;
            } else if (error.error?.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Unable to add trip. Please check the entered information and try again.';
            }

            this.cdr.detectChanges();
          }
        });
    }
  }

  // get the form short name to access the form fields
  get f() {
    return this.addForm.controls;
  }
}