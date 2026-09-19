import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  LucideAngularModule,
  Plus,
  Search,
  Eye,
  Pencil,
  Ban,
  RotateCcw,
  X,
  Package,
  PackageOpen,
  TriangleAlert,
  RefreshCw,
} from 'lucide-angular';

import { Material } from '../../../../core/models/material.model';
import { MaterialService } from '../../../../core/services/material.service';
import { MaterialViewDialog } from '../material-view-dialog/material-view-dialog';
import { MaterialStatusDialog } from '../material-status-dialog/material-status-dialog';
import { MaterialEditDialog } from '../material-edit-dialog/material-edit-dialog';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    LucideAngularModule,
    MaterialViewDialog,
    MaterialEditDialog,
    MaterialStatusDialog
  ],
  templateUrl: './material-list.html',
  styleUrl: './material-list.scss',
})
export class MaterialList implements OnInit {

  materials: Material[] = [];
  filteredMaterials: Material[] = [];

  searchTerm = '';
  isLoading = false;
  errorMessage = '';

  isViewDialogOpen = false;

  isEditDialogOpen = false;
  selectedMaterial: Material | null = null;
  isSaving = false;
  editErrorMessage = '';

  isStatusDialogOpen = false;
  selectedStatusMaterial: Material | null = null;

  isStatusSaving = false;
  statusErrorMessage = '';

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly Pencil = Pencil;
  readonly Ban = Ban;
  readonly RotateCcw = RotateCcw;
  readonly X = X;
  readonly Package = Package;
  readonly PackageOpen = PackageOpen;
  readonly TriangleAlert = TriangleAlert;
  readonly RefreshCw = RefreshCw;

  constructor(
    private materialService: MaterialService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.materialService.getAllMaterials().subscribe({
      next: (response) => {

        this.materials = response.data;
        this.filteredMaterials = [...this.materials];

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load materials';

        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    const search = this.searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      this.filteredMaterials = [...this.materials];
      return;
    }

    this.filteredMaterials = this.materials.filter(
      (material) =>
        material.name.toLowerCase().includes(search) ||
        material.unit.toLowerCase().includes(search) ||
        material.description
          ?.toLowerCase()
          .includes(search)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredMaterials = [...this.materials];
  }

  openViewDialog(material: Material): void {
    this.selectedMaterial = material;
    this.isViewDialogOpen = true;
  }

  closeViewDialog(): void {
    this.isViewDialogOpen = false;
    this.selectedMaterial = null;
  }

  openEditDialog(material: Material): void {
    this.selectedMaterial = material;
    this.editErrorMessage = '';
    this.isEditDialogOpen = true;
  }

  closeEditDialog(): void {
    if (this.isSaving) {
      return;
    }

    this.isEditDialogOpen = false;
    this.selectedMaterial = null;
    this.editErrorMessage = '';
  }

  saveMaterialChanges(data: {
    name: string;
    unit: string;
    description: string;
  }): void {

    if (!this.selectedMaterial || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.editErrorMessage = '';

    const materialId = this.selectedMaterial.id;

    this.materialService.updateMaterial(materialId, data).subscribe({
      next: (response) => {

        const updatedMaterial = response.data;

        // Update main array
        const materialIndex = this.materials.findIndex(
          material => material.id === materialId
        );

        if (materialIndex !== -1) {
          this.materials[materialIndex] = updatedMaterial;
        }

        // Re-apply current search
        this.onSearch();

        this.isSaving = false;
        this.isEditDialogOpen = false;
        this.selectedMaterial = null;

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.isSaving = false;

        this.editErrorMessage =
          error?.error?.message ||
          'Failed to update material. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  openStatusDialog(material: Material): void {
    this.selectedStatusMaterial = material;
    this.statusErrorMessage = '';
    this.isStatusDialogOpen = true;
  }

  closeStatusDialog(): void {
    if (this.isStatusSaving) {
      return;
    }

    this.isStatusDialogOpen = false;
    this.selectedStatusMaterial = null;
    this.statusErrorMessage = '';
  }

  changeMaterialStatus(): void {
    if (!this.selectedStatusMaterial || this.isStatusSaving) {
      return;
    }

    const material = this.selectedStatusMaterial;

    this.isStatusSaving = true;
    this.statusErrorMessage = '';

    const request$ = material.is_active
      ? this.materialService.deleteMaterial(material.id)
      : this.materialService.restoreMaterial(material.id);

    request$.subscribe({
      next: (response) => {
        const updatedMaterial = response.data;

        const materialIndex = this.materials.findIndex(
          item => item.id === material.id
        );

        if (materialIndex !== -1) {
          this.materials[materialIndex] = updatedMaterial;
        }

        this.onSearch();

        this.isStatusSaving = false;
        this.isStatusDialogOpen = false;
        this.selectedStatusMaterial = null;

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isStatusSaving = false;

        this.statusErrorMessage =
          error?.error?.message ||
          'Failed to change material status. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }
}
