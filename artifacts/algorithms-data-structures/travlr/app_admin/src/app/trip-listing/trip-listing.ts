import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TripCard } from '../trip-card/trip-card';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData]
})
export class TripListing implements OnInit {

  // Stores the complete trip collection retrieved from the API.
  // The displayed trips array can then be filtered or sorted without
  // modifying the original collection.
  allTrips: Trip[] = [];
  trips: Trip[] = [];
  searchTerm: string = '';
  sortOption: string = 'original';
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

  // Rebuilds the displayed trip collection from the complete dataset.
  // Filtering performs a linear O(n) scan. Sorting is applied only to
  // the filtered subset so records that will not be displayed are not sorted.
  public applyFiltersAndSort(): void {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    let processedTrips: Trip[];

    if (!normalizedSearch) {
      processedTrips = [...this.allTrips];
    } else {
      processedTrips = this.allTrips.filter((trip: Trip) => {
        return (
          trip.name.toLowerCase().includes(normalizedSearch) ||
          trip.resort.toLowerCase().includes(normalizedSearch) ||
          trip.code.toLowerCase().includes(normalizedSearch)
        );
      });
    }

    switch (this.sortOption) {
      case 'name-asc':
        processedTrips.sort((a: Trip, b: Trip) =>
          a.name.localeCompare(b.name)
        );
        break;

      case 'name-desc':
        processedTrips.sort((a: Trip, b: Trip) =>
          b.name.localeCompare(a.name)
        );
        break;

      case 'price-asc':
        processedTrips.sort((a: Trip, b: Trip) =>
          this.getNumericPrice(a.perPerson) - this.getNumericPrice(b.perPerson)
        );
        break;

      case 'price-desc':
        processedTrips.sort((a: Trip, b: Trip) =>
          this.getNumericPrice(b.perPerson) - this.getNumericPrice(a.perPerson)
        );
        break;

      case 'date-asc':
        processedTrips.sort((a: Trip, b: Trip) =>
          new Date(a.start).getTime() - new Date(b.start).getTime()
        );
        break;

      case 'date-desc':
        processedTrips.sort((a: Trip, b: Trip) =>
          new Date(b.start).getTime() - new Date(a.start).getTime()
        );
        break;

      default:
        // Preserve the original API order when no explicit sort is selected.
        break;
    }

    this.trips = processedTrips;
    this.changeDetectorRef.markForCheck();
  }

  // Converts the stored price string to a numeric value for comparison.
  // Non-numeric characters are removed so formatted prices can still be sorted.
  private getNumericPrice(price: string): number {
    const numericPrice = Number(price.replace(/[^0-9.-]+/g, ''));
    return Number.isNaN(numericPrice) ? 0 : numericPrice;
  }

  // Processes confirmed delete requests and synchronizes both client-side
  // trip collections after the API successfully deletes the database record.
  public deleteTrip(trip: Trip): void {
    this.tripDataService.deleteTrip(trip.code)
      .subscribe({
        next: () => {
          this.allTrips = this.allTrips.filter(
            currentTrip => currentTrip.code !== trip.code
          );

          this.message = 'Trip successfully deleted.';
          this.applyFiltersAndSort();
        },
        error: (error: any) => {
          console.log('Error deleting trip: ' + error);
          this.message = 'Unable to delete trip.';
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  // Retrieves the complete trip collection from the API and initializes
  // both the authoritative and displayed trip arrays.
  private getStuff(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: Trip[]) => {
          this.allTrips = [...value];
          this.trips = [...value];

          if (value.length > 0) {
            this.message = 'There are ' + value.length + ' trips available.';
          } else {
            this.message = 'There were no trips retrieved from the database';
          }

          console.log(this.message);
          this.changeDetectorRef.detectChanges();
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