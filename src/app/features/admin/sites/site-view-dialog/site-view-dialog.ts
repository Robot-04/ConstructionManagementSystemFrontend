import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  LucideAngularModule,
  X,
  MapPin,
  User,
  CalendarDays
} from 'lucide-angular';

import { Site } from '../../../../core/models/site.model';

@Component({
  selector: 'app-site-view-dialog',
  imports: [LucideAngularModule],
  templateUrl: './site-view-dialog.html',
  styleUrl: './site-view-dialog.scss'
})
export class SiteViewDialog {

  @Input({ required: true })
  site!: Site;

  @Output()
  closed = new EventEmitter<void>();

  readonly X = X;
  readonly MapPin = MapPin;
  readonly User = User;
  readonly CalendarDays = CalendarDays;

  getLocation(): string {
    return [
      this.site.city,
      this.site.state
    ]
      .filter(Boolean)
      .join(', ') || 'Location not provided';
  }

  closeDialog(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeDialog();
    }
  }
}
