type AssetUrlResolver = (fileName: string) => string;

export function applyThemeImages(assetUrl: AssetUrlResolver): void {
  document.documentElement.style.setProperty('--bg-image', `url("${assetUrl('background.png')}")`);
  document.documentElement.style.setProperty(
    '--left-strip-image',
    `url("${assetUrl('vertical-strip-left.png')}")`,
  );
  document.documentElement.style.setProperty(
    '--right-strip-image',
    `url("${assetUrl('vertical-strip-right.png')}")`,
  );
}
