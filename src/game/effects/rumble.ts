export function triggerRumble(interactionZone: HTMLDivElement): void {
  interactionZone.classList.remove('rumble');
  void interactionZone.offsetWidth;
  interactionZone.classList.add('rumble');
}
