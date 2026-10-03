import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TripCard } from '../trip-card/trip-card';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData]
})
export class TripListing implements OnInit {

  trips!: Trip[];
  message: string = '';

  constructor(
    private tripDataService: TripData,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private authenticationService: Authentication
  ) {
    console.log('trip-listing constructor');
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  // Processes confirmed delete requests and updates the displayed trip list
  // Added DELETE functionality 09/17/26
  public deleteTrip(trip: Trip): void {
    this.tripDataService.deleteTrip(trip.code)
      .subscribe({
        next: () => {
          this.trips = this.trips.filter(
            currentTrip => currentTrip.code !== trip.code
          );

          this.message = 'Trip successfully deleted.';
          this.changeDetectorRef.markForCheck();
        },
        error: (error: any) => {
          console.log('Error deleting trip: ' + error);
          this.message = 'Unable to delete trip.';
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  private getStuff(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: any) => {
          this.trips = value;
          this.changeDetectorRef.markForCheck();

          if (value.length > 0) {
            this.message = 'There are ' + value.length + ' trips available.';
          } else {
            this.message = 'There were no trips retrieved from the database';
          }

          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }
}