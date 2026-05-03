/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PASSPHRASE: string;
  readonly VITE_SECRET_MESSAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
