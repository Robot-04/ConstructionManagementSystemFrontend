import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  LoginRequest,
  LoginResponse
} from '../models/auth.model';

import {
  User,
  UserRole
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  private readonly tokenKey = 'construction_token';
  private readonly userKey = 'construction_user';


  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/auth/login`,
        credentials
      )
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          this.setSession(
            response.data.token,
            response.data.user
          );
        })
      );
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  getUser(): User | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    return JSON.parse(user) as User;
  }


  getRole(): UserRole | null {
    return this.getUser()?.role ?? null;
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }


  private setSession(
    token: string,
    user: User
  ): void {
    localStorage.setItem(
      this.tokenKey,
      token
    );

    localStorage.setItem(
      this.userKey,
      JSON.stringify(user)
    );
  }
}
