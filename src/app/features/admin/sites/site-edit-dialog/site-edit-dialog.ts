import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  LucideAngularModule,
  MapPin,
  Save,
  X,
  AlertCircle
} from 'lucide-angular';

import { SiteService } from '../../../../core/services/site.service';
import {
  Site,
  UpdateSiteRequest
} from '../../../../core/models/site.model';

@Component({
  selector: 'app-site-edit-dialog',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './site-edit-dialog.html',
  styleUrl: './site-edit-dialog.scss'
})
export class SiteEditDialog {

  private readonly fb = inject(FormBuilder);
  private readonly siteService = inject(SiteService);

  @Input({ required: true })
  site!: Site;

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<Site>();

  isSaving = false;
  errorMessage = '';

  readonly MapPin = MapPin;
  readonly Save = Save;
  readonly X = X;
  readonly AlertCircle = AlertCircle;

  readonly siteForm = this.fb.nonNullable.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]],

    address: ['', [
      Validators.required,
      Validators.maxLength(255)
    ]],

    city: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],

    state: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],

    pincode: ['', [
      Validators.required,
      Validators.pattern(/^\d{6}$/)
    ]]
  });


  ngOnInit(): void {
    this.siteForm.patchValue({
      name: this.site.name,
      address: this.site.address,
      city: this.site.city ?? '',
      state: this.site.state ?? '',
      pincode: this.site.pincode ?? ''
    });
  }


  get name() {
    return this.siteForm.controls.name;
  }

  get address() {
    return this.siteForm.controls.address;
  }

  get city() {
    return this.siteForm.controls.city;
  }

  get state() {
    return this.siteForm.controls.state;
  }

  get pincode() {
    return this.siteForm.controls.pincode;
  }


  close(): void {
    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }


  save(): void {

    this.errorMessage = '';

    if (this.siteForm.invalid) {
      this.siteForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const formValue = this.siteForm.getRawValue();

    const request: UpdateSiteRequest = {
      name: formValue.name.trim(),
      address: formValue.address.trim(),
      city: formValue.city.trim(),
      state: formValue.state.trim(),
      pincode: formValue.pincode.trim()
    };

    this.siteService.updateSite(
      this.site.id,
      request
    ).subscribe({

      next: response => {

        this.isSaving = false;

        if (response?.data) {
          this.saved.emit(response.data);
        }

        this.closed.emit();
      },

      error: error => {

        console.error(
          'Site update failed:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to update site. Please try again.';

        this.isSaving = false;
      }

    });
  }
}
