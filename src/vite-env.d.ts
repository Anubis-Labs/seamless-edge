/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  // Add other environment variables here as needed
}
