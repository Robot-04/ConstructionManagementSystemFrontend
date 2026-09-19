import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  LucideAngularModule,
  X,
  Package,
} from 'lucide-angular';

import { Material } from '../../../../core/models/material.model';

@Component({
  selector: 'app-material-view-dialog',
  standalone: true,
  imports: [
    LucideAngularModule,
  ],
  templateUrl: './material-view-dialog.html',
  styleUrl: './material-view-dialog.scss',
})
export class MaterialViewDialog {

  @Input({ required: true })
  material!: Material;

  @Output()
  closed = new EventEmitter<void>();

  readonly X = X;
  readonly Package = Package;

  close(): void {
    this.closed.emit();
  }
}
