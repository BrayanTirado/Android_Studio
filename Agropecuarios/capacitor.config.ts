import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'CRUD-maria',
  webDir: 'www',
  plugins: {
    Camera: {
      allowEditing: false,
      quality: 90,
      resultType: 'dataUrl',
      source: 'prompt',
      promptLabelHeader: 'Seleccionar fuente',
      promptLabelPhoto: 'Tomar Foto',
      promptLabelPicture: 'Seleccionar de Galería'
    }
  }
};

export default config;
