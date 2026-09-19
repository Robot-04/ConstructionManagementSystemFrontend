import { Component, inject } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet]
})
export class App {

  private readonly themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
