export class ChestTransitionEffect {
  private readonly chestImg: HTMLImageElement;

  constructor(chestImg: HTMLImageElement) {
    this.chestImg = chestImg;
  }

  toWhite(): Promise<void> {
    return new Promise((resolve) => {
      let settled = false;

      const finish = (): void => {
        if (settled) {
          return;
        }

        settled = true;
        this.chestImg.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };

      const onTransitionEnd = (event: TransitionEvent): void => {
        if (event.propertyName === 'filter') {
          finish();
        }
      };

      this.chestImg.classList.add('chest-white');
      this.chestImg.addEventListener('transitionend', onTransitionEnd);

      window.setTimeout(finish, 320);
    });
  }
}
