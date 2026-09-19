import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  UserResponse,
  UsersResponse,
  CreateManagerRequest,
  CreateManagerResponse,
  UpdateManagerRequest
} from '../models/manager.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getAllManagers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(
      `${this.apiUrl}/user`
    );
  }

  getManagerById(
    id: number
  ): Observable<UserResponse> {

    return this.http.get<UserResponse>(
      `${this.apiUrl}/user/${id}`
    );
  }

  createManager(
    manager: CreateManagerRequest
  ): Observable<CreateManagerResponse> {

    return this.http.post<CreateManagerResponse>(
      `${this.apiUrl}/user`,
      manager
    );
  }

  updateManager(
    id: number,
    manager: UpdateManagerRequest
  ): Observable<{ success: boolean; message: string }> {

    return this.http.put<{
      success: boolean;
      message: string;
    }>(
      `${this.apiUrl}/user/${id}`,
      manager
    );
  }

  deleteManager(
    id: number
  ): Observable<{ success: boolean; message: string }> {

    return this.http.delete<{
      success: boolean;
      message: string;
    }>(
      `${this.apiUrl}/user/${id}`
    );
  }

  restoreManager(
    id: number
  ): Observable<{ success: boolean; message: string }> {

    return this.http.patch<{
      success: boolean;
      message: string;
    }>(
      `${this.apiUrl}/user/${id}/restore`,
      {}
    );
  }
}
