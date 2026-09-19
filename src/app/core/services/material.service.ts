import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Material,
  CreateMaterialDto,
  UpdateMaterialDto,
} from '../models/material.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAllMaterials(): Observable<{
    success: boolean;
    message: string;
    data: Material[];
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      data: Material[];
    }>(
      `${this.apiUrl}/material`
    );
  }

  getMaterialById(
    id: number
  ): Observable<{
    success: boolean;
    message: string;
    data: Material;
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      data: Material;
    }>(
      `${this.apiUrl}/material/${id}`
    );
  }

  createMaterial(
    material: CreateMaterialDto
  ): Observable<{
    success: boolean;
    message: string;
    data: {
      id: number;
    };
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      data: {
        id: number;
      };
    }>(
      `${this.apiUrl}/material`,
      material
    );
  }

  updateMaterial(
    id: number,
    material: UpdateMaterialDto
  ): Observable<{
    success: boolean;
    message: string;
    data: Material;
  }> {
    return this.http.put<{
      success: boolean;
      message: string;
      data: Material;
    }>(
      `${this.apiUrl}/material/${id}`,
      material
    );
  }

  deleteMaterial(
    id: number
  ): Observable<{
    success: boolean;
    message: string;
    data: Material;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
      data: Material;
    }>(
      `${this.apiUrl}/material/${id}`
    );
  }

  restoreMaterial(
    id: number
  ): Observable<{
    success: boolean;
    message: string;
    data: Material;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
      data: Material;
    }>(
      `${this.apiUrl}/material/${id}/restore`,
      {}
    );
  }
}
