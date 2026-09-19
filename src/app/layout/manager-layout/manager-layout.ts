import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-manager-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './manager-layout.html',
  styleUrl: './manager-layout.scss',
})
export class ManagerLayout {}
