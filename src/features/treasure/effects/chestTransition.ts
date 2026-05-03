export class ChestTransitionEffect {
  private readonly chestImg: HTMLImageElement;
  private transitionTimeoutId: number | null = null;
  private transitionEndHandler: ((event: TransitionEvent) => void) | null = null;
  private pendingResolve: (() => void) | null = null;

  constructor(chestImg: HTMLImageElement) {
    this.chestImg = chestImg;
  }

  dispose(): void {
    this.finishPendingTransition();
    this.chestImg.classList.remove('chest-white');
  }

  toWhite(): Promise<void> {
    this.finishPendingTransition();

    return new Promise((resolve) => {
      let settled = false;

      const finish = (): void => {
        if (settled) {
          return;
        }

        settled = true;
        this.detachPendingTransition();
        resolve();
      };

      const onTransitionEnd = (event: TransitionEvent): void => {
        if (event.propertyName === 'filter') {
          finish();
        }
      };

      this.pendingResolve = finish;
      this.transitionEndHandler = onTransitionEnd;
      this.chestImg.classList.add('chest-white');
      this.chestImg.addEventListener('transitionend', onTransitionEnd);
      this.transitionTimeoutId = window.setTimeout(finish, 320);
    });
  }

  private finishPendingTransition(): void {
    const pendingResolve = this.pendingResolve;
    if (!pendingResolve) {
      this.detachPendingTransition();
      return;
    }

    pendingResolve();
  }

  private detachPendingTransition(): void {
    if (this.transitionEndHandler) {
      this.chestImg.removeEventListener('transitionend', this.transitionEndHandler);
      this.transitionEndHandler = null;
    }

    if (this.transitionTimeoutId !== null) {
      window.clearTimeout(this.transitionTimeoutId);
      this.transitionTimeoutId = null;
    }

    this.pendingResolve = null;
  }
}
