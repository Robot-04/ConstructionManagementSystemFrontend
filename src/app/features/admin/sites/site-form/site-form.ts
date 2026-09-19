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

import { ActivatedRoute, Router } from '@angular/router';

import {
  LucideAngularModule,
  ArrowLeft,
  MapPin
} from 'lucide-angular';

import { SiteService } from '../../../../core/services/site.service';

@Component({
  selector: 'app-site-form',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './site-form.html',
  styleUrl: './site-form.scss'
})
export class SiteForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly siteService = inject(SiteService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly ArrowLeft = ArrowLeft;
  readonly MapPin = MapPin;

  isEditMode = false;
  siteId: number | null = null;

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  siteForm = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    address: [
      '',
      [
        Validators.required,
        Validators.minLength(5)
      ]
    ],

    city: [
      ''
    ],

    state: [
      ''
    ],

    pincode: [
      '',
      [
        Validators.pattern(/^\d{6}$/)
      ]
    ]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.siteId = Number(id);
      this.loadSite(this.siteId);
    }
  }

  private loadSite(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.siteService.getSiteById(id).subscribe({
      next: response => {

        const site = response?.data;

        if (!site) {
          this.errorMessage = 'Site information could not be found.';
          this.isLoading = false;
          return;
        }

        this.siteForm.patchValue({
          name: site.name,
          address: site.address,
          city: site.city ?? '',
          state: site.state ?? '',
          pincode: site.pincode ?? ''
        });

        this.isLoading = false;
      },

      error: error => {
        console.error(
          'Site loading failed:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to load site information.';

        this.isLoading = false;
      }
    });
  }

  isInvalid(
    controlName: 'name' | 'address' | 'city' | 'state' | 'pincode'
  ): boolean {

    const control =
      this.siteForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  onSubmit(): void {

    if (this.siteForm.invalid) {
      this.siteForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.siteId === null) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue =
      this.siteForm.getRawValue();

    const siteData = {
      name: formValue.name.trim(),
      address: formValue.address.trim(),
      city: formValue.city.trim() || undefined,
      state: formValue.state.trim() || undefined,
      pincode: formValue.pincode.trim() || undefined
    };

    if (this.isEditMode && this.siteId !== null) {

      this.siteService
        .updateSite(this.siteId, siteData)
        .subscribe({

          next: response => {
            console.log(
              'Site updated:',
              response
            );

            this.isSaving = false;

            this.router.navigate([
              '/admin/sites'
            ]);
          },

          error: error => {
            console.error(
              'Site update failed:',
              error
            );

            this.errorMessage =
              error?.error?.message ||
              'Unable to update site.';

            this.isSaving = false;
          }
        });

      return;
    }

    this.siteService
      .createSite(siteData)
      .subscribe({

        next: response => {
          console.log(
            'Site created:',
            response
          );

          this.isSaving = false;

          this.router.navigate([
            '/admin/sites'
          ]);
        },

        error: error => {
          console.error(
            'Site creation failed:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to create site.';

          this.isSaving = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate([
      '/admin/sites'
    ]);
  }
}
