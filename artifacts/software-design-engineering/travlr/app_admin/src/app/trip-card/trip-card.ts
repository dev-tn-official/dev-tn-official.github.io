// EventEmitter and Output support delete requests to the parent trip listing
// Added DELETE functionality on 09/17/26
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {

@Input() trip!: Trip;

// Emits a delete request to the parent trip listing
// Added DELETE functionality on 09/17/26
@Output() deleteRequested = new EventEmitter<Trip>();

  constructor(
    private router: Router,
    private authenticationService: Authentication
  ) {}

  public editTrip(trip: Trip): void {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  // Added deleteTrip method on 09/17/26
  public deleteTrip(trip: Trip): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${trip.name}?`
    );

    if (confirmed) {
      this.deleteRequested.emit(trip);
    }
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}