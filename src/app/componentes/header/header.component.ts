import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { RouterModule } from '@angular/router';

export type DockSection = 'inicio' | 'products' | 'assist' | 'connect';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() activeSection: DockSection = 'inicio';
  @Input() darkMode = false;

  @Output() sectionChange = new EventEmitter<DockSection>();
  @Output() darkModeChange = new EventEmitter<boolean>();

  readonly items: {
    id: DockSection;
    label: string;
    path: string;
  }[] = [
    {
      id: 'inicio',
      label: 'Inicio',
      path: 'M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6'
    },
    {
      id: 'products',
      label: 'Productos',
      path:
        'M9 7V4h6v3 M4 7h16v13H4z M4 12h16 M10 12v2h4v-2'
    },
    {
      id: 'assist',
      label: 'Asistencia',
      path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5 M12 17h.01'
      //'m8 8-4 4 4 4 M16 8l4 4-4 4 M14 5l-4 14'//signo de codigo
    },
    {
      id: 'connect',
      label: 'Contacto',
      path: 'M3 6h18v12H3z M3 7l9 6 9-6'
      //'M4 12h16 M14 6l6 6-6 6' //Flecha
    }
  ];

  get activeIndex(): number {
    return Math.max(
      0,
      this.items.findIndex(item => item.id === this.activeSection)
    );
  }

  select(index: number): void {
    const normalized = (index + this.items.length) % this.items.length;

    this.activeSection = this.items[normalized].id;
    this.sectionChange.emit(this.activeSection);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();

    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex =
      (this.activeIndex + direction + this.items.length) % this.items.length;

    this.select(nextIndex);

    // Mantiene el foco en la opción seleccionada.
    const container = event.currentTarget as HTMLElement;
    container
      .querySelectorAll<HTMLButtonElement>('.nav-item')
      [nextIndex]?.focus();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.darkModeChange.emit(this.darkMode);
  }
}
