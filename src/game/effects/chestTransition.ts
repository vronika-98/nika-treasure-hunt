export function transitionChestToWhite(chestImg: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (): void => {
      if (settled) {
        return;
      }

      settled = true;
      chestImg.removeEventListener('transitionend', onTransitionEnd);
      resolve();
    };

    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.propertyName === 'filter') {
        finish();
      }
    };

    chestImg.classList.add('chest-white');
    chestImg.addEventListener('transitionend', onTransitionEnd);

    window.setTimeout(finish, 320);
  });
}
