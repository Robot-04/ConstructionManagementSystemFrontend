import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  LucideAngularModule,
  X,
  UserPlus,
  ChevronDown,
  Check
} from 'lucide-angular';

import { ManagerService } from '../../../../core/services/manager.service';
import { SiteService } from '../../../../core/services/site.service';
import { Site } from '../../../../core/models/site.model';

@Component({
  selector: 'app-manager-edit-dialog',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './manager-edit-dialog.html',
  styleUrl: './manager-edit-dialog.scss'
})
export class ManagerEditDialog implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly managerService = inject(ManagerService);
  private readonly siteService = inject(SiteService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true })
  managerId!: number;

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<void>();

  readonly X = X;
  readonly UserPlus = UserPlus;
  readonly ChevronDown = ChevronDown;
  readonly Check = Check;

  isLoading = false;
  isSaving = false;

  isSiteDropdownOpen = false;

  errorMessage = '';

  selectedSite: Site | null = null;

  availableSites: Site[] = [];

  managerForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    phone: [
      '',
      [
        Validators.pattern(/^[6-9]\d{9}$/)
      ]
    ],

    site_id: [
      null as number | null
    ]

  });


  ngOnInit(): void {
    this.loadManager();
  }

  private loadManager(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.managerService
      .getManagerById(this.managerId)
      .subscribe({
        next: response => {
          const manager = response.data;

          console.log('EDIT MANAGER:', manager);

          this.managerForm.patchValue({
            name: manager.name,
            email: manager.email,
            phone: manager.phone ?? ''
          });

          this.loadSitesForEdit(manager.id);
        },

        error: error => {
          console.error(
            'Manager loading failed:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load manager.';

          this.isLoading = false;

          this.cdr.detectChanges();
        }
      });
  }

  private loadSitesForEdit(managerId: number): void {
    this.siteService
      .getAllSites()
      .subscribe({
        next: response => {

          const allSites = response.data;

          console.log('EDIT → All sites:', allSites);

          const assignedSite =
            allSites.find(
              site => site.manager_id === managerId
            ) ?? null;

          console.log(
            'EDIT → Assigned site:',
            assignedSite
          );

          this.selectedSite = assignedSite;

          const availableSites =
            allSites.filter(
              site =>
                site.is_active === 1 &&
                site.manager_id === null
            );

          if (assignedSite) {
            this.availableSites = [
              assignedSite,
              ...availableSites
            ];

            this.managerForm.patchValue({
              site_id: assignedSite.id
            });
          } else {
            this.availableSites = availableSites;

            this.managerForm.patchValue({
              site_id: null
            });
          }

          // IMPORTANT
          this.isLoading = false;

          // Force Angular to update the dialog immediately
          this.cdr.detectChanges();
        },

        error: error => {
          console.error(
            'Sites loading failed:',
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

  private loadSites(
    assignedSiteId: number | null
  ): void {

    this.siteService
      .getAvailableSites()
      .subscribe({

        next: sites => {

          this.availableSites = sites;

          /*
           * Manager already has a site.
           * Fetch that site separately and add it
           * to the dropdown.
           */
          if (assignedSiteId !== null) {

            this.loadAssignedSite(
              assignedSiteId
            );

          } else {

            this.selectedSite = null;
            this.isLoading = false;

          }

        },

        error: error => {

          console.error(
            'Available sites loading failed:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load available sites.';

          this.isLoading = false;
        }

      });
  }


  private loadAssignedSite(
    siteId: number
  ): void {

    this.siteService
      .getSiteById(siteId)
      .subscribe({

        next: response => {

          const assignedSite =
            response.data;


          this.selectedSite =
            assignedSite;

          /*
           * The assigned site is normally NOT returned
           * by getAvailableSites() because it already
           * belongs to this manager.
           *
           * Add it manually so it appears in the dropdown.
           */
          const alreadyExists =
            this.availableSites.some(
              site =>
                site.id === assignedSite.id
            );

          if (!alreadyExists) {

            this.availableSites = [
              assignedSite,
              ...this.availableSites
            ];

          }

          this.isLoading = false;
        },

        error: error => {

          console.error(
            'Assigned site loading failed:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load assigned site.';

          this.isLoading = false;
        }

      });
  }


  toggleSiteDropdown(): void {

    this.isSiteDropdownOpen =
      !this.isSiteDropdownOpen;

  }


  selectSite(site: Site | null): void {

    this.selectedSite = site;

    this.managerForm.patchValue({

      site_id:
        site?.id ?? null

    });

    this.isSiteDropdownOpen = false;
  }


  get selectedSiteName(): string {

    return (
      this.selectedSite?.name ??
      'No site assigned'
    );

  }


  isInvalid(
    controlName:
      'name' |
      'email' |
      'phone'
  ): boolean {

    const control =
      this.managerForm.get(
        controlName
      );

    return !!(
      control &&
      control.invalid &&
      (
        control.dirty ||
        control.touched
      )
    );
  }


  onSubmit(): void {

    if (this.managerForm.invalid) {

      this.managerForm.markAllAsTouched();

      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue =
      this.managerForm.getRawValue();

    const managerData = {

      name:
        formValue.name.trim(),

      email:
        formValue.email.trim(),

      phone:
        formValue.phone || undefined,

      site_id:
        formValue.site_id

    };

    this.managerService
      .updateManager(
        this.managerId,
        managerData
      )
      .subscribe({

        next: response => {

          console.log(
            'Manager updated:',
            response
          );

          this.isSaving = false;

          this.saved.emit();

          this.closed.emit();

        },

        error: error => {

          console.error(
            'Manager update failed:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to update manager.';

          this.isSaving = false;
        }

      });
  }


  closeDialog(): void {

    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }


  onBackdropClick(
    event: MouseEvent
  ): void {

    if (
      event.target ===
      event.currentTarget
    ) {

      this.closeDialog();

    }
  }

}
