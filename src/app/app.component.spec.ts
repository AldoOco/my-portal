import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { ProductsComponent } from './pages/products/products.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let element: HTMLElement;

  const getHeader = (): HeaderComponent =>
    fixture.debugElement.query(By.directive(HeaderComponent))
      .componentInstance as HeaderComponent;

  const getButtons = (): HTMLButtonElement[] =>
    Array.from(element.querySelectorAll<HTMLButtonElement>('.nav-item'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  it('debe crear la aplicación', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar la barra de navegación', () => {
    const header = fixture.debugElement.query(
      By.directive(HeaderComponent)
    );

    expect(header).toBeTruthy();
  });

  it('debe iniciar con inicio seleccionado y el tema claro', () => {
    const header = getHeader();

    expect(component.currentSection).toBe('inicio');
    expect(component.darkMode).toBe(false);

    expect(header.activeSection).toBe('inicio');
    expect(header.darkMode).toBe(false);

    expect(
      element.querySelector('.selection')?.textContent
    ).toContain('Sección seleccionada: inicio');
  });

  it('debe actualizar la sección cuando se selecciona una opción', () => {
    const header = getHeader();
    const target = header.items.findIndex(item => item.id === 'assist');

    expect(target).toBeGreaterThanOrEqual(0);

    getButtons()[target].click();
    fixture.detectChanges();

    expect(component.currentSection).toBe('assits');
    expect(
      element.querySelector('.selection')?.textContent
    ).toContain('Sección seleccionada: assits');
  });

  it('debe transmitir al header los cambios de sección del padre', () => {
    component.onSectionChange('assist');
    fixture.detectChanges();

    const header = getHeader();
    const target = header.items.findIndex(item => item.id === 'assist');

    expect(header.activeSection).toBe('assits');
    expect(getButtons()[target].classList.contains('active')).toBe(true);
  });

  it('debe activar el tema oscuro desde la barra', () => {
    const toggle =
      element.querySelector<HTMLButtonElement>('.mode-toggle')!;

    toggle.click();
    fixture.detectChanges();

    expect(component.darkMode).toBe(true);
    expect(getHeader().darkMode).toBe(true);

    expect(
      element.querySelector('main')!.classList.contains('page-dark')
    ).toBe(true);

    expect(
      element.querySelector('.dock-wrapper')!.classList.contains('dark')
    ).toBe(true);
  });

  it('debe volver al tema claro al pulsar nuevamente el botón', () => {
    const toggle =
      element.querySelector<HTMLButtonElement>('.mode-toggle')!;

    toggle.click();
    fixture.detectChanges();

    toggle.click();
    fixture.detectChanges();

    expect(component.darkMode).toBe(false);

    expect(
      element.querySelector('.app-shell')!.classList.contains('page-dark')
    ).toBe(false);

    expect(
      element.querySelector('.app-shell app-footer')
    ).toBeTruthy();

    expect(
      element.querySelector('.dock-wrapper')!.classList.contains('dark')
    ).toBe(false);
  });

  it('debe navegar a la ruta de la opción seleccionada', async () => {
  const router = TestBed.inject(Router);
  const header = getHeader();
  const target = header.items.findIndex(item => item.id === 'products');

  getButtons()[target].click();
  await fixture.whenStable();
  fixture.detectChanges();

  expect(router.url).toBe('/products');
  expect(
    fixture.debugElement.query(By.directive(ProductsComponent))
  ).toBeTruthy();
});

it('debe marcar la opción activa cuando cambia la URL', async () => {
  const router = TestBed.inject(Router);

  await router.navigateByUrl('/assits');
  fixture.detectChanges();

  expect(component.currentSection).toBe('assits');
});
});