import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteEditDialog } from '../site-edit-dialog/site-edit-dialog';
import {
  LucideAngularModule,
  Plus,
  Search,
  Eye,
  Pencil,
  MapPin,
  UserX,
  UserCheck
} from 'lucide-angular';

import { SiteService } from '../../../../core/services/site.service';
import { Site } from '../../../../core/models/site.model';

import { SiteViewDialog } from '../site-view-dialog/site-view-dialog';
import { SiteStatusDialog } from '../site-status-dialog/site-status-dialog';

@Component({
  selector: 'app-site-list',
  imports: [
    FormsModule,
    RouterLink,
    LucideAngularModule,
    SiteViewDialog,
    SiteStatusDialog,
    SiteEditDialog
  ],
  templateUrl: './site-list.html',
  styleUrl: './site-list.scss'
})
export class SiteList implements OnInit {

  private readonly siteService = inject(SiteService);
  private readonly cdr = inject(ChangeDetectorRef);

  sites: Site[] = [];
  filteredSites: Site[] = [];

  searchTerm = '';

  isLoading = true;
  errorMessage = '';

  // Dialog state
  selectedSite: Site | null = null;

  showViewDialog = false;
  showStatusDialog = false;

  showEditDialog = false;


  // Icons
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly Pencil = Pencil;
  readonly MapPin = MapPin;
  readonly UserX = UserX;
  readonly UserCheck = UserCheck;


  ngOnInit(): void {
    this.loadSites();
  }

  openEditDialog(site: Site): void {
    this.selectedSite = site;
    this.showEditDialog = true;
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.selectedSite = null;
  }

  onSiteSaved(updatedSite: Site): void {
    const index = this.sites.findIndex(
      site => site.id === updatedSite.id
    );

    if (index !== -1) {
      this.sites[index] = updatedSite;
    }

    this.onSearch();

    this.closeEditDialog();

    this.cdr.detectChanges();
  }


  loadSites(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.siteService.getAllSites().subscribe({

      next: response => {

        this.sites = response?.data ?? [];
        this.filteredSites = this.sites;

        this.isLoading = false;

        console.log(this.sites)

        this.cdr.detectChanges();
      },


      error: error => {

        console.error(
          'Site loading failed:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to load sites.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });
  }


  // ================================
  // Search
  // ================================

  onSearch(): void {

    const search = this.searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      this.filteredSites = this.sites;
      return;
    }

    this.filteredSites = this.sites.filter(site => {

      const location = [
        site.address,
        site.city,
        site.state,
        site.pincode
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        site.name.toLowerCase().includes(search) ||
        location.includes(search)
      );

    });
  }


  // ================================
  // View Dialog
  // ================================

  openViewDialog(site: Site): void {

    this.selectedSite = site;
    this.showViewDialog = true;

  }


  closeViewDialog(): void {

    this.showViewDialog = false;
    this.selectedSite = null;

  }


  // ================================
  // Status Dialog
  // ================================

  openStatusDialog(site: Site): void {

    this.selectedSite = site;
    this.showStatusDialog = true;

  }


  closeStatusDialog(): void {

    this.showStatusDialog = false;
    this.selectedSite = null;

  }


  onSiteStatusChanged(): void {

    this.closeStatusDialog();

    this.loadSites();

  }


  // ================================
  // Helpers
  // ================================

  getLocation(site: Site): string {

    return [
      site.city,
      site.state
    ]
      .filter(Boolean)
      .join(', ') || 'Location not provided';

  }


  getManagerText(site: Site): string {

    return site.manager_id !== null
      ? `Manager #${site.manager_id}`
      : 'Unassigned';

  }

}
