import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DashboardResponse, ManagerDashboardResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getAdminDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${this.apiUrl}/dashboard/admin`
    );
  }

  getManagerDashboard(): Observable<ManagerDashboardResponse> {
    return this.http.get<ManagerDashboardResponse>(
      `${this.apiUrl}/dashboard/manager`
    );
  }
}
