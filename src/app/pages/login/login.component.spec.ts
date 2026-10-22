import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe girar la cabeza al enfocar la contraseña', () => {
    element
      .querySelector<HTMLInputElement>('input[type="password"]')!
      .dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(
      element.querySelector('.robot')!.classList.contains('is-turned')
    ).toBe(true);
  });

  it('debe sacudir el formulario si faltan datos', () => {
    element
      .querySelector<HTMLFormElement>('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(
      element.querySelector('.card')!.classList.contains('shake')
    ).toBe(true);
  });
});