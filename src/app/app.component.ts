import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent, DockSection } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  private readonly router = inject(Router);

  private readonly validSections: DockSection[] = [
    'inicio',
    'products',
    'assist',
    'connect'
  ];

  title = 'my-portal';

  currentSection: DockSection = 'inicio';
  darkMode = false;
  isLoginPage = false;

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(event => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        const segment = url.split(/[?#]/)[0].split('/')[1] || 'inicio';
        this.isLoginPage = segment === 'login';
        const match = this.validSections.find(s => s === segment);

        //this.currentSection = match ?? 'inicio';
        if (match) {
          this.currentSection = match;
        } else if (segment !== 'login') {
          this.currentSection = 'inicio';
        }
      });
  }

  onSectionChange(section: DockSection): void {
    this.currentSection = section;
    this.router.navigateByUrl(section === 'inicio' ? '/' : `/${section}`);
  }

}
