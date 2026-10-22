import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent, DockSection } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let element: HTMLElement;

  const getButtons = (): HTMLButtonElement[] =>
    Array.from(element.querySelectorAll<HTMLButtonElement>('.nav-item'));

  // const pressKey = (target: HTMLElement, key: string): KeyboardEvent => {
  //   const event = new KeyboardEvent('keydown', {
  //     key,
  //     bubbles: true,
  //     cancelable: true
  //   });

  //   target.dispatchEvent(event);
  //   fixture.detectChanges();

  //   return event;
  // };

  const pressKey = (target: HTMLElement, key: string): KeyboardEvent => {
    target.focus();

    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true
    });

    target.dispatchEvent(event);
    fixture.detectChanges();

    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar una opción por cada elemento de items', () => {
    const labels = Array.from(
      element.querySelectorAll<HTMLElement>('.nav-label')
    ).map(label => label.textContent?.trim());

    expect(labels).toEqual(component.items.map(item => item.label));
    expect(getButtons().length).toBe(component.items.length);
  });

  it('debe seleccionar Inicio inicialmente', () => {
    const buttons = getButtons();

    expect(component.activeSection).toBe('inicio');
    expect(component.activeIndex).toBe(0);
    expect(buttons[0].classList.contains('active')).toBe(true);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('debe actualizar la selección cuando cambia el input', () => {
    const last = component.items.length - 1;

    fixture.componentRef.setInput(
      'activeSection',
      component.items[last].id
    );
    fixture.detectChanges();

    expect(component.activeIndex).toBe(last);
    expect(getButtons()[last].classList.contains('active')).toBe(true);
  });

  it('debe seleccionar una opción y emitir el evento al hacer clic', () => {
    let emittedSection: DockSection | undefined;

    component.sectionChange.subscribe(section => {
      emittedSection = section;
    });

    const target = 2;
    const expectedId = component.items[target].id;

    getButtons()[target].click();
    fixture.detectChanges();

    expect(component.activeSection).toBe(expectedId);
    expect(emittedSection).toBe(expectedId);
    expect(getButtons()[target].classList.contains('active')).toBe(true);
    expect(getButtons()[0].classList.contains('active')).toBe(false);
  });

  it('debe mover el indicador cuando cambia la selección', () => {
    getButtons()[2].click();
    fixture.detectChanges();

    const bead = element.querySelector<HTMLElement>('.active-bead')!;

    expect(bead.style.transform).toBe('translateX(200%)');
  });

  it('debe avanzar con ArrowRight y mover el foco', () => {
    const buttons = getButtons();

    const event = pressKey(buttons[0], 'ArrowRight');

    expect(component.activeSection).toBe(component.items[1].id);
    expect(document.activeElement).toBe(buttons[1]);
    expect(event.defaultPrevented).toBe(true);
  });

  it('debe retroceder con ArrowLeft', () => {
    const buttons = getButtons();

    fixture.componentRef.setInput(
      'activeSection',
      component.items[1].id
    );
    fixture.detectChanges();

    pressKey(buttons[1], 'ArrowLeft');

    expect(component.activeSection).toBe(component.items[0].id);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('debe volver a la primera opción al avanzar desde la última', () => {
    const buttons = getButtons();
    const last = buttons.length - 1;

    fixture.componentRef.setInput(
      'activeSection',
      component.items[last].id
    );
    fixture.detectChanges();

    pressKey(buttons[last], 'ArrowRight');

    expect(component.activeSection).toBe(component.items[0].id);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('debe ir a la última opción al retroceder desde la primera', () => {
    const buttons = getButtons();
    const last = buttons.length - 1;

    pressKey(buttons[0], 'ArrowLeft');

    expect(component.activeSection).toBe(component.items[last].id);
    expect(document.activeElement).toBe(buttons[last]);
  });

  it('no debe cambiar la selección con otras teclas', () => {
    const event = pressKey(getButtons()[1], 'Escape');

    expect(component.activeSection).toBe('inicio');
    expect(event.defaultPrevented).toBe(false);
  });

  it('debe activar el tema oscuro y emitir el nuevo estado', () => {
    let emittedTheme: boolean | undefined;

    component.darkModeChange.subscribe(darkMode => {
      emittedTheme = darkMode;
    });

    const toggle =
      element.querySelector<HTMLButtonElement>('.mode-toggle')!;

    toggle.click();
    fixture.detectChanges();

    expect(component.darkMode).toBe(true);
    expect(emittedTheme).toBe(true);
    expect(
      element.querySelector('.dock-wrapper')!.classList.contains('dark')
    ).toBe(true);
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('debe permitir volver al tema claro', () => {
    fixture.componentRef.setInput('darkMode', true);
    fixture.detectChanges();

    const toggle =
      element.querySelector<HTMLButtonElement>('.mode-toggle')!;

    toggle.click();
    fixture.detectChanges();

    expect(component.darkMode).toBe(false);
    expect(
      element.querySelector('.dock-wrapper')!.classList.contains('dark')
    ).toBe(false);
  });

  it('debe responder a las flechas sin que el foco esté en la barra', () => {
    (document.activeElement as HTMLElement | null)?.blur();

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true
    });

    document.body.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.activeSection).toBe(component.items[1].id);
    expect(event.defaultPrevented).toBe(true);
  });

  it('debe enlazar el botón Login con /login', () => {
    const link = element.querySelector<HTMLAnchorElement>('a.login-btn')!;

    expect(link.getAttribute('href')).toBe('/login');
  });

});