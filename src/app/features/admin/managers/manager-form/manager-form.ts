import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import {
  LucideAngularModule,
  ArrowLeft,
  UserPlus,
  ChevronDown,
  Check
} from 'lucide-angular';

import { ManagerService } from '../../../../core/services/manager.service';
import { SiteService } from '../../../../core/services/site.service';
import { Site } from '../../../../core/models/site.model';

@Component({
  selector: 'app-manager-form',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './manager-form.html',
  styleUrl: './manager-form.scss'
})
export class ManagerForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly managerService = inject(ManagerService);
  private readonly siteService = inject(SiteService);
  private readonly router = inject(Router);

  readonly ArrowLeft = ArrowLeft;
  readonly UserPlus = UserPlus;
  readonly ChevronDown = ChevronDown;
  readonly Check = Check;

  isSiteDropdownOpen = false;

  selectedSite: Site | null = null;

  availableSites: Site[] = [];

  isLoading = false;
  isSaving = false;

  errorMessage = '';

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
    this.loadAvailableSites();
  }

  toggleSiteDropdown(): void {
    this.isSiteDropdownOpen =
      !this.isSiteDropdownOpen;
  }

  selectSite(site: Site | null): void {

    this.selectedSite = site;

    this.managerForm.patchValue({
      site_id: site?.id ?? null
    });

    this.isSiteDropdownOpen = false;
  }

  get selectedSiteName(): string {
    return this.selectedSite?.name ?? 'No site assigned';
  }

  private loadAvailableSites(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.siteService
      .getAvailableSites()
      .subscribe({

        next: sites => {

          this.availableSites = sites;

          this.isLoading = false;
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

  isInvalid(
    controlName: 'name' | 'email' | 'phone'
  ): boolean {

    const control =
      this.managerForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
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

    this.managerService
      .createManager({

        name: formValue.name.trim(),

        email: formValue.email.trim(),

        phone:
          formValue.phone || undefined,

        role: 'MANAGER',

        site_id: formValue.site_id

      })
      .subscribe({

        next: response => {

          console.log(
            'Manager created:',
            response
          );

          this.isSaving = false;

          this.router.navigate([
            '/admin/managers'
          ]);
        },

        error: error => {

          console.error(
            'Manager creation failed:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to create manager.';

          this.isSaving = false;
        }

      });
  }

  goBack(): void {

    this.router.navigate([
      '/admin/managers'
    ]);
  }
}
