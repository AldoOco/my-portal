import {  Component,  ElementRef,  HostListener,  OnDestroy,  OnInit,  Renderer2,  ViewChild,  inject} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

type Mood =
  | 'idle'
  | 'watching'
  | 'happy'
  | 'shy'
  | 'excited'
  | 'pressed'
  | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONFETTI_COLORS = ['#ff6b4b', '#2ec4b6', '#ffc53d', '#23252d', '#fffdf8'];
const METER_LABELS = ['NOT LOOKING', 'TOO SHORT', 'GETTING THERE', 'STRONG', 'FORT KNOX'];

const pick = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('scene', { static: true }) sceneRef!: ElementRef<HTMLElement>;
  @ViewChild('robot', { static: true }) robotRef!: ElementRef<HTMLElement>;
  @ViewChild('bubble', { static: true }) bubbleRef!: ElementRef<HTMLElement>;
  @ViewChild('card', { static: true }) cardRef!: ElementRef<HTMLElement>;
  @ViewChild('nameInput', { static: true }) nameRef!: ElementRef<HTMLInputElement>;
  @ViewChild('emailInput', { static: true }) emailRef!: ElementRef<HTMLInputElement>;
  @ViewChild('passInput', { static: true }) passRef!: ElementRef<HTMLInputElement>;
  @ViewChild('peekBtn', { static: true }) peekRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('loginBtn', { static: true }) btnRef!: ElementRef<HTMLButtonElement>;

  private readonly renderer = inject(Renderer2);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  mood: Mood = 'idle';
  turned = false;
  pressed = false;
  hyped = false;
  spinning = false;
  blinking = false;
  success = false;
  passVisible = false;

  bubbleText = "Hola. Soy Volty. Custodio estas claves.";
  panelLabel = 'NO VEO ;)';
  btnLabel = 'INGRESAR';
  meterLevel = 0;

  lx = 0;
  ly = 0;
  rx = 0;
  ry = 0;

  private done = false;
  private lastSaid = '';
  private rafPending = false;
  private pressTimer?: number;
  private readonly timers = new Set<number>();
  // private readonly reduceMotion = matchMedia(
  //   '(prefers-reduced-motion: reduce)'
  // ).matches;
  private reduceMotion = false;

  ngOnInit(): void {
    //this.blinkLoop();
    if (!this.isBrowser) {
      return;
    }

    this.reduceMotion = matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.blinkLoop();
  }

  ngOnDestroy(): void {
    this.timers.forEach(id => clearTimeout(id));
    this.timers.clear();
  }

  private later(fn: () => void, ms: number): number {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);

    this.timers.add(id);
    return id;
  }

  private cancel(id?: number): void {
    if (id === undefined) {
      return;
    }

    clearTimeout(id);
    this.timers.delete(id);
  }

  private setMood(mood: Mood): void {
    if (!this.done) {
      this.mood = mood;
    }
  }

  private say(text: string): void {
    if (text === this.lastSaid) {
      return;
    }

    this.lastSaid = text;
    this.bubbleText = text;

    const bubble = this.bubbleRef.nativeElement;
    bubble.classList.remove('pop');
    void bubble.offsetWidth;
    bubble.classList.add('pop');
  }

  private look(x: number, y: number): void {
    this.lx = x;
    this.ly = y;
  }

  private tilt(ry: number, rx: number): void {
    this.ry = ry;
    this.rx = rx;
  }

  private followTyping(input: HTMLInputElement): void {
    const ratio = Math.min(input.value.length / 22, 1);

    this.look(-6 + 12 * ratio, 5);
    this.tilt(-5 + 10 * ratio, -8);
  }

  private blinkLoop(): void {
    this.later(() => {
      if (this.mood !== 'success' && !this.turned) {
        this.blinking = true;
        this.later(() => (this.blinking = false), 150);
      }

      this.blinkLoop();
    }, 2600 + Math.random() * 2600);
  }

  onNameFocus(): void {
    this.turned = false;
    this.setMood('watching');
    this.say(
      pick([
        'Un visitante. Diga su nombre.',
        "Se detecta escritura. Adelante, estoy observando."
      ])
    );
    this.followTyping(this.nameRef.nativeElement);
  }

  onNameInput(): void {
    const input = this.nameRef.nativeElement;
    const value = input.value.trim();

    this.followTyping(input);

    if (value.length >= 2) {
      this.say(`${value}. Un nombre sólido. Archivado para siempre.`);
    } else if (value.length === 0) {
      this.say("Eliminado. Ya lo he olvidado. Más o menos.");
    }
  }

  onEmailFocus(): void {
    this.turned = false;
    this.setMood('watching');
    this.say("A continuación, el correo electrónico. No manejo spam; ni siquiera tengo una bandeja de entrada.");
    this.followTyping(this.emailRef.nativeElement);
  }

  onEmailInput(): void {
    const input = this.emailRef.nativeElement;

    this.followTyping(input);

    if (EMAIL_RE.test(input.value.trim())) {
      this.setMood('happy');
      this.say(
        pick([
          'Now that is a proper email. Respect.',
          'Valid address detected. Quietly delighted.'
        ])
      );
    } else {
      this.setMood('watching');

      if (input.value.includes('@')) {
        this.say('Close. My sensors say: not yet.');
      }
    }
  }

  onPassFocus(): void {
    this.setMood('shy');
    this.turned = true;
    this.look(0, 0);
    this.tilt(0, 0);
    this.say('¿Un secreto? No se diga más. *se da la vuelta*');
    this.panelLabel = 'NO VEO ;)';
  }

  onPassBlur(event: FocusEvent): void {
    if (event.relatedTarget === this.peekRef.nativeElement) {
      return;
    }

    this.turned = false;
  }

  onPassInput(): void {
    const value = this.passRef.nativeElement.value;
    let score = 0;

    if (value.length >= 8) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^a-zA-Z0-9]/.test(value)) score++;
    if (value.length > 0 && score === 0) score = 1;

    this.meterLevel = score;
    this.panelLabel = value.length === 0 ? METER_LABELS[0] : METER_LABELS[score];
  }

  togglePass(): void {
    this.passVisible = !this.passVisible;

    if (this.passVisible) {
      this.say("Revealing it? Good thing I'm facing the wall.");
    }

    this.passRef.nativeElement.focus();
  }

  hype(on: boolean): void {
    if (this.done) {
      return;
    }

    if (on && this.pressed) {
      return;
    }

    this.hyped = on;

    if (on) {
      this.turned = false;
      this.setMood('excited');
      this.say(pick(['Ooh. Do it. Press it.', 'This is my favorite part.']));
    } else {
      this.setMood('idle');
      this.say('The button misses you already.');
    }
  }

  onPress(): void {
    this.cancel(this.pressTimer);
    this.pressed = true;
    this.mood = 'pressed';
    this.say(pick(['Ahh. That’s the stuff.', 'Mmm. Satisfying.', 'Beep. Do that again.']));
  }

  releasePress(): void {
    this.cancel(this.pressTimer);

    this.pressTimer = this.later(() => {
      this.pressed = false;

      if (this.mood === 'pressed') {
        this.mood = this.done ? 'success' : 'excited';
      }
    }, 340);
  }

  onPointerLeave(): void {
    if (this.pressed) {
      this.releasePress();
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.done) {
      return;
    }

    const name = this.nameRef.nativeElement.value.trim();
    const email = this.emailRef.nativeElement.value.trim();
    const password = this.passRef.nativeElement.value;

    let complaint: [string, HTMLInputElement] | null = null;

    if (!name) {
      complaint = ["Sigo sin saber tu nombre.", this.nameRef.nativeElement];
    } else if (!EMAIL_RE.test(email)) {
      complaint = ["Ese correo electrónico no es auténtico.", this.emailRef.nativeElement];
    } else if (!password) {
      complaint = ['Una contraseña ayudaría.', this.passRef.nativeElement];
    }

    if (complaint) {
      const [message, field] = complaint;

      this.later(() => {
        this.say(message);
        this.setMood('watching');
      }, 380);

      const card = this.cardRef.nativeElement;
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');

      field.focus();
      return;
    }

    this.done = true;
    this.turned = false;
    this.hyped = false;

    this.later(() => {
      this.mood = 'success';
      this.say(`Acceso concedido. Bienvenido, ${name}.`);
      this.success = true;
      this.btnLabel = 'ACCESO CONCEDIDO ✓';
      this.look(0, 0);
      this.tilt(0, 0);

      if (!this.reduceMotion) {
        this.spinning = true;
        this.later(() => (this.spinning = false), 950);
        this.confetti();
      }
    }, 420);

    this.later(() => this.reset(), 5600);
  }

  private reset(): void {
    this.done = false;
    this.mood = 'idle';
    this.success = false;
    this.btnLabel = 'LOG ME IN';
    this.say('Again? I could do this all day.');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const active = document.activeElement;

    if (this.done || (active && active.tagName === 'INPUT')) {
      return;
    }

    if (this.rafPending) {
      return;
    }

    this.rafPending = true;

    requestAnimationFrame(() => {
      this.rafPending = false;

      const rect = this.robotRef.nativeElement.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (event.clientX - cx) / 260));
      const dy = Math.max(-1, Math.min(1, (event.clientY - cy) / 260));

      this.look(dx * 7, dy * 6);

      if (!this.turned) {
        this.tilt(dx * 12, -dy * 9);
      }
    });
  }

  private confetti(): void {
    const scene = this.sceneRef.nativeElement;
    const origin = this.btnRef.nativeElement.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    const ox = origin.left - sceneRect.left + origin.width / 2;
    const oy = origin.top - sceneRect.top;

    for (let i = 0; i < 70; i++) {
      const bit = this.renderer.createElement('span') as HTMLElement;

      bit.className = 'confetti';
      bit.style.background = pick(CONFETTI_COLORS);

      if (Math.random() > 0.5) {
        bit.style.borderRadius = '50%';
      }

      this.renderer.appendChild(scene, bit);

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const speed = 240 + Math.random() * 380;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed;
      const spin = 540 * (Math.random() > 0.5 ? 1 : -1);

      bit
        .animate(
          [
            {
              transform: `translate(${ox}px, ${oy}px) rotate(0deg) scale(1)`,
              opacity: 1
            },
            {
              transform: `translate(${ox + tx}px, ${oy + ty + 320}px) rotate(${spin}deg) scale(.6)`,
              opacity: 0
            }
          ],
          {
            duration: 1100 + Math.random() * 700,
            easing: 'cubic-bezier(.15,.6,.35,1)'
          }
        )
        .onfinish = () => bit.remove();
    }
  }
}