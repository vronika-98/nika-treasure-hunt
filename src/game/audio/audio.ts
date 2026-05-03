type AssetUrlResolver = (fileName: string) => string;

export type GameAudio = {
  wowAudio: HTMLAudioElement;
  failAudio: HTMLAudioElement;
};

export function createGameAudio(assetUrl: AssetUrlResolver): GameAudio {
  const wowAudio = new Audio(assetUrl('wow.mp3'));
  const failAudio = new Audio(assetUrl('fail.mp3'));
  wowAudio.preload = 'auto';
  failAudio.preload = 'auto';

  return { wowAudio, failAudio };
}

export function playAudio(audio: HTMLAudioElement): void {
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Ignore autoplay policy rejections if the browser blocks sound.
  });
}
