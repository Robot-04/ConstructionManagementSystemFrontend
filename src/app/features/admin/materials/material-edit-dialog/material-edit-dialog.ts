import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  LucideAngularModule,
  X,
  Package,
  Save,
  TriangleAlert,
} from 'lucide-angular';

import { Material } from '../../../../core/models/material.model';

@Component({
  selector: 'app-material-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './material-edit-dialog.html',
  styleUrl: './material-edit-dialog.scss',
})
export class MaterialEditDialog implements OnChanges {

  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) material!: Material;

  @Input() isSaving = false;
  @Input() errorMessage = '';

  @Output() closed = new EventEmitter<void>();

  @Output() saved = new EventEmitter<{
    name: string;
    unit: string;
    description: string;
  }>();


  // --------------------------------------------------
  // Icons
  // --------------------------------------------------

  readonly X = X;
  readonly Package = Package;
  readonly Save = Save;
  readonly TriangleAlert = TriangleAlert;


  // --------------------------------------------------
  // Form
  // --------------------------------------------------

  materialForm = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(150),
      ],
    ],

    unit: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
      ],
    ],

    description: [
      '',
      [
        Validators.maxLength(1000),
      ],
    ],
  });


  // --------------------------------------------------
  // Input Changes
  // --------------------------------------------------

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['material'] && this.material) {

      this.materialForm.patchValue({
        name: this.material.name,
        unit: this.material.unit,
        description: this.material.description ?? '',
      });

      this.materialForm.markAsPristine();
      this.materialForm.markAsUntouched();
    }
  }


  // --------------------------------------------------
  // Close
  // --------------------------------------------------

  close(): void {

    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }


  // --------------------------------------------------
  // Save
  // --------------------------------------------------

  save(): void {

    if (this.materialForm.invalid || this.isSaving) {

      this.materialForm.markAllAsTouched();

      return;
    }

    const formValue = this.materialForm.getRawValue();

    this.saved.emit({
      name: formValue.name.trim(),
      unit: formValue.unit.trim(),
      description: formValue.description.trim(),
    });
  }


  // --------------------------------------------------
  // Form Controls
  // --------------------------------------------------

  get nameControl() {
    return this.materialForm.controls.name;
  }

  get unitControl() {
    return this.materialForm.controls.unit;
  }

  get descriptionControl() {
    return this.materialForm.controls.description;
  }
}
