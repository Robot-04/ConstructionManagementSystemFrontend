import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  LucideAngularModule,
  Plus,
  Search,
  Eye,
  Pencil,
  UserX,
  UserCheck,
  X
} from 'lucide-angular';

import { ManagerStatusDialog } from '../manager-status-dialog/manager-status-dialog';
import { ManagerEditDialog } from '../manager-edit-dialog/manager-edit-dialog';

import { ManagerService } from '../../../../core/services/manager.service';
import { User } from '../../../../core/models/user.model';

import { SiteService } from '../../../../core/services/site.service';
import { Site } from '../../../../core/models/site.model';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-managers-list',
  imports: [
    RouterLink,
    LucideAngularModule,
    FormsModule,
    ManagerEditDialog,
    ManagerStatusDialog
  ],
  templateUrl: './managers-list.html',
  styleUrl: './managers-list.scss'
})
export class ManagersList implements OnInit {

  // ==========================================
  // Services
  // ==========================================

  private readonly managerService = inject(ManagerService);
  private readonly siteService = inject(SiteService);
  private readonly cdr = inject(ChangeDetectorRef);


  // ==========================================
  // Data
  // ==========================================

  sites: Site[] = [];
  managers: User[] = [];
  filteredManagers: User[] = [];


  // ==========================================
  // Icons
  // ==========================================

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly Pencil = Pencil;
  readonly UserX = UserX;
  readonly UserCheck = UserCheck;
  readonly X = X;


  // ==========================================
  // Search
  // ==========================================

  searchTerm = '';


  // ==========================================
  // Edit Manager Dialog
  // ==========================================

  isEditDialogOpen = false;
  editingManagerId: number | null = null;

  openEditManager(id: number): void {
    this.editingManagerId = id;
    this.isEditDialogOpen = true;
  }

  closeEditManager(): void {
    this.isEditDialogOpen = false;
    this.editingManagerId = null;
  }

  onManagerUpdated(): void {
    this.closeEditManager();
    this.loadData();
  }


  // ==========================================
  // Manager Status Dialog
  // ==========================================

  isStatusDialogOpen = false;
  statusManager: User | null = null;

  openStatusDialog(manager: User): void {
    this.statusManager = manager;
    this.isStatusDialogOpen = true;
  }

  closeStatusDialog(): void {
    this.isStatusDialogOpen = false;
    this.statusManager = null;
  }

  onManagerStatusChanged(): void {
    this.closeStatusDialog();
    this.loadData();
  }


  // ==========================================
  // View Manager Dialog
  // ==========================================

  selectedManager: User | null = null;
  isViewDialogOpen = false;

  openViewDialog(manager: User): void {
    this.selectedManager = manager;
    this.isViewDialogOpen = true;
  }

  closeViewDialog(): void {
    this.isViewDialogOpen = false;
    this.selectedManager = null;
  }


  // ==========================================
  // Loading / Error
  // ==========================================

  isLoading = true;
  errorMessage = '';


  // ==========================================
  // Lifecycle
  // ==========================================

  ngOnInit(): void {
    this.loadData();
  }


  // ==========================================
  // Site Helper
  // ==========================================

  getSiteName(
    siteId: number | null | undefined
  ): string {

    if (!siteId) {
      return 'Not assigned';
    }

    const site = this.sites.find(
      site => site.id === siteId
    );

    return site?.name ?? 'Unknown site';
  }


  // ==========================================
  // Load Managers + Sites
  // ==========================================

  private loadData(): void {

    this.isLoading = true;
    this.errorMessage = '';

    // Execute both HTTP requests in parallel
    forkJoin({
      managersRes: this.managerService.getAllManagers(),
      sitesRes: this.siteService.getAllSites()
    }).subscribe({

      next: ({ managersRes, sitesRes }) => {

        // Safe extraction for managers
        const managerData =
          managersRes?.data || managersRes || [];

        if (Array.isArray(managerData)) {

          this.managers = managerData.filter(
            user => user?.role === 'MANAGER'
          );

          this.filteredManagers = this.managers;
        }


        // Safe extraction for sites
        const siteData =
          sitesRes?.data || sitesRes || [];

        if (Array.isArray(siteData)) {
          this.sites = siteData;
        }


        this.isLoading = false;

        // Keep ChangeDetectorRef as requested
        this.cdr.detectChanges();

      },

      error: error => {

        console.error(
          'Data loading failed:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to load required data.';

        this.isLoading = false;

        // Keep ChangeDetectorRef as requested
        this.cdr.detectChanges();
      }
    });
  }


  // ==========================================
  // Search Managers
  // ==========================================

  onSearch(): void {

    const search = this.searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      this.filteredManagers = this.managers;
      return;
    }

    this.filteredManagers =
      this.managers.filter(manager => {

        const siteName =
          this.getSiteName(manager.site_id);

        return (
          manager.name
            .toLowerCase()
            .includes(search) ||

          manager.email
            .toLowerCase()
            .includes(search) ||

          (manager.phone ?? '')
            .includes(search) ||

          siteName
            .toLowerCase()
            .includes(search)
        );
      });
  }
}
