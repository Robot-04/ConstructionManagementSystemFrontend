import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  Site,
  SiteResponse,
  SingleSiteResponse,
  CreateSiteRequest,
  UpdateSiteRequest
} from '../models/site.model';

@Injectable({
  providedIn: 'root'
})

export class SiteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAllSites(): Observable<SiteResponse> {
    return this.http.get<SiteResponse>(
      `${this.apiUrl}/site`
    );
  }

  getAvailableSites(): Observable<Site[]> {
    return this.getAllSites().pipe(
      map(response =>
        response.data.filter(site =>
          site.is_active === 1 &&
          site.manager_id === null
        )
      )
    );
  }

  getSiteById(
    id: number
  ): Observable<SingleSiteResponse> {
    return this.http.get<SingleSiteResponse>(
      `${this.apiUrl}/site/${id}`
    );
  }

  createSite(
    site: CreateSiteRequest
  ): Observable<SingleSiteResponse> {
    return this.http.post<SingleSiteResponse>(
      `${this.apiUrl}/site`,
      site
    );
  }

  updateSite(
    id: number,
    site: UpdateSiteRequest
  ): Observable<SingleSiteResponse> {
    return this.http.put<SingleSiteResponse>(
      `${this.apiUrl}/site/${id}`,
      site
    );
  }

  deleteSite(
    id: number
  ): Observable<SingleSiteResponse> {
    return this.http.delete<SingleSiteResponse>(
      `${this.apiUrl}/site/${id}`
    );
  }

  restoreSite(
    id: number
  ): Observable<SingleSiteResponse> {
    return this.http.patch<SingleSiteResponse>(
      `${this.apiUrl}/site/${id}/restore`,
      {}
    );
  }
}
