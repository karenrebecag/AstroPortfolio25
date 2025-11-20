/**
 * Cursor Class
 *
 * Encapsulates the entire state and logic for the custom cursor.
 */
import { isTouchDevice, lerp } from './utils';
import { initClickAudio, playClickSound } from './audio';

export class Cursor {
  private cursor: HTMLElement;
  private cursorText: HTMLElement;
  private cursorTextContent: HTMLElement;
  private body: HTMLBodyElement;

  private isActive = false;
  private currentX = 0;
  private currentY = 0;
  private targetX = 0;
  private targetY = 0;
  private currentRotation = 0;
  private targetRotation = 0;
  private lastX = 0;
  private lastY = 0;
  private textCurrentX = 0;
  private textCurrentY = 0;
  private textTargetX = 0;
  private textTargetY = 0;
  private isTextVisible = false;

  private enterHandlers = new WeakMap<Element, () => void>();
  private leaveHandlers = new WeakMap<Element, () => void>();

  constructor() {
    this.cursor = document.getElementById('custom-cursor')!;
    this.cursorText = document.getElementById('cursor-text')!;
    this.cursorTextContent = document.querySelector('.cursor-text-content')!;
    this.body = document.body;
  }

  public init() {
    if (isTouchDevice() || !this.cursor || !this.cursorText || !this.cursorTextContent) {
      return;
    }

    initClickAudio();
    this.addEventListeners();
    this.update();
    this.addHoverEffects();

    const observer = new MutationObserver(() => this.addHoverEffects());
    observer.observe(this.body, { childList: true, subtree: true });

    window.addEventListener('beforeunload', () => {
      this.removeEventListeners();
      observer.disconnect();
      this.hideText();
    });
  }

  private update = () => {
    this.currentX = lerp(this.currentX, this.targetX, 0.15);
    this.currentY = lerp(this.currentY, this.targetY, 0.15);
    this.currentRotation = lerp(this.currentRotation, this.targetRotation, 0.1);

    const transformValue = `translate(${this.currentX}px, ${this.currentY}px) translate(-50%, -50%) rotate(${this.currentRotation}deg)`;
    this.cursor.style.transform = transformValue;

    if (this.isTextVisible) {
      this.textCurrentX = lerp(this.textCurrentX, this.textTargetX, 0.12);
      this.textCurrentY = lerp(this.textCurrentY, this.textTargetY, 0.12);
      const textTransformValue = `translate(${this.textCurrentX}px, ${this.textCurrentY}px) translate(-50%, -50%)`;
      this.cursorText.style.transform = textTransformValue;
    }

    requestAnimationFrame(this.update);
  }

  private handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - this.lastX;
    const deltaY = e.clientY - this.lastY;
    this.targetX = e.clientX;
    this.targetY = e.clientY;

    if (this.isTextVisible) {
      this.textTargetX = e.clientX + 20;
      this.textTargetY = e.clientY - 30;
    }

    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      this.targetRotation = this.calculateRotation(deltaX, deltaY);
    }

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  private show = (e?: MouseEvent) => {
    if (!this.isActive) {
      this.isActive = true;
      this.body.classList.add('custom-cursor-active');
      this.cursor.style.opacity = '1';
      this.lastX = e?.clientX || 0;
      this.lastY = e?.clientY || 0;
      this.targetX = this.lastX;
      this.targetY = this.lastY;
      this.currentX = this.lastX;
      this.currentY = this.lastY;
    }
  }

  private hide = () => {
    if (this.isActive) {
      this.isActive = false;
      this.body.classList.remove('custom-cursor-active');
      this.cursor.style.opacity = '0';
      this.hideText();
    }
  }

  private showText = (text: string) => {
    if (!this.isTextVisible && this.isActive) {
      this.isTextVisible = true;
      this.cursorTextContent.textContent = text;
      this.cursorText.dataset.textVisible = 'true';
      this.textTargetX = this.targetX + 20;
      this.textTargetY = this.targetY - 30;
      this.textCurrentX = this.textTargetX;
      this.textCurrentY = this.textTargetY;
    }
  }

  private hideText = () => {
    if (this.isTextVisible) {
      this.isTextVisible = false;
      delete this.cursorText.dataset.textVisible;
    }
  }

  private getElementText(element: Element): string {
    const customText = element.getAttribute('data-cursor-text');
    if (customText) return customText;

    const tagName = element.tagName.toLowerCase();
    if (tagName === 'a') return 'Visit';
    if (tagName === 'button' || element.getAttribute('role') === 'button') return 'Click';
    if (['input', 'textarea', 'select'].includes(tagName)) return 'Focus';
    
    if (element.closest('.project-item')) return 'Expand Project';
    if (element.closest('.service-item')) return 'Expand Service';

    return 'Click';
  }

  private addHoverEffects() {
    const interactiveElements = document.querySelectorAll(`
      a, button, [role="button"], input, textarea, select, label,
      [class*="hover:scale"], [class*="cursor-pointer"], .clickable
    `);
    
    interactiveElements.forEach(element => {
      const oldEnterHandler = this.enterHandlers.get(element);
      if (oldEnterHandler) element.removeEventListener('mouseenter', oldEnterHandler);
      
      const oldLeaveHandler = this.leaveHandlers.get(element);
      if (oldLeaveHandler) element.removeEventListener('mouseleave', oldLeaveHandler);

      const enterHandler = () => {
        if (this.isActive) {
          this.cursor.dataset.hover = 'true';
          this.showText(this.getElementText(element));
        }
      };

      const leaveHandler = () => {
        if (this.isActive) {
          delete this.cursor.dataset.hover;
          this.hideText();
        }
      };

      const clickHandler = () => {
        if (this.isActive) playClickSound();
      };

      this.enterHandlers.set(element, enterHandler);
      this.leaveHandlers.set(element, leaveHandler);

      element.addEventListener('mouseenter', enterHandler);
      element.addEventListener('mouseleave', leaveHandler);
      element.addEventListener('click', clickHandler);
    });
  }

  private calculateRotation(deltaX: number, deltaY: number): number {
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return this.targetRotation;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
  }

  private addEventListeners() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseenter', this.show);
    document.addEventListener('mouseleave', this.hide);
  }

  private removeEventListeners() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseenter', this.show);
    document.removeEventListener('mouseleave', this.hide);
  }
}
