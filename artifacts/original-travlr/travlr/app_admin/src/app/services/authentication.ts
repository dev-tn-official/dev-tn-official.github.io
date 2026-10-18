import { Inject, Injectable, signal } from '@angular/core';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

@Injectable({
  providedIn: 'root'
})
export class Authentication {

  authResp: AuthResponse = new AuthResponse();

  private loggedInState = signal<boolean>(false);

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripData
  ) {
    this.loggedInState.set(this.hasValidToken());
  }

  public getToken(): string {
    const out = this.storage.getItem('travlr-token');

    if (!out) {
      return '';
    }

    return out;
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
    this.loggedInState.set(true);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
    this.loggedInState.set(false);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();

    if (token) {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload.exp > (Date.now() / 1000);
    }

    return false;
  }

  public isLoggedIn(): boolean {
    return this.loggedInState();
  }

  public getCurrentUser(): User {
    const token = this.getToken();

    const { email, name } = JSON.parse(
      atob(token.split('.')[1])
    );

    return { email, name } as User;
  }

  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd)
      .subscribe({
        next: (value: AuthResponse) => {
          if (value) {
            console.log(value);
            this.authResp = value;
            this.saveToken(this.authResp.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd)
      .subscribe({
        next: (value: AuthResponse) => {
          if (value) {
            console.log(value);
            this.authResp = value;
            this.saveToken(this.authResp.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }
}