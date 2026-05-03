type AssetUrlResolver = (fileName: string) => string;

export class GameAudioController {
  private readonly wowAudio: HTMLAudioElement;
  private readonly failAudio: HTMLAudioElement;

  constructor(assetUrl: AssetUrlResolver) {
    this.wowAudio = new Audio(assetUrl('wow.mp3'));
    this.failAudio = new Audio(assetUrl('fail.mp3'));
    this.wowAudio.preload = 'auto';
    this.failAudio.preload = 'auto';
  }

  playSuccess(): void {
    this.play(this.wowAudio);
  }

  playFailure(): void {
    this.play(this.failAudio);
  }

  dispose(): void {
    this.wowAudio.pause();
    this.failAudio.pause();
    this.wowAudio.currentTime = 0;
    this.failAudio.currentTime = 0;
  }

  private play(audio: HTMLAudioElement): void {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore autoplay policy rejections if the browser blocks sound.
    });
  }
}
