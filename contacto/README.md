# Contacto - CRUD Ionic

Aplicación Ionic (standalone) con CRUD de contactos (nombre, apellido, empresa, teléfono, correo, dirección, nota, otros) y soporte para foto de contacto.

Archivos añadidos / modificados:
- src/app/services/contact.service.ts
- src/app/contact-list/contact-list.page.ts
- src/app/contact-form/contact-form.page.ts
- src/app/contact-detail/contact-detail.page.ts
- src/app/app.routes.ts (rutas actualizadas)

Ejecución en desarrollo:
1. Abrir terminal y entrar en la carpeta del proyecto:
   cd contacto
2. Instalar dependencias:
   npm install
3. Iniciar la app:
   npm run start
4. Abrir en el navegador:
   http://localhost:4200

Funcionalidad de fotos:
- El formulario permite adjuntar una foto desde el dispositivo (input type="file").
- La foto se guarda en el campo `foto` del modelo de contacto como una data URL (base64) dentro de localStorage.
- Storage: las fotos aumentan el tamaño de localStorage; para imágenes grandes puede quedarse sin espacio. Si planeas usar muchas fotos, considera almacenar en servidor o usar almacenamiento nativo.
- El listado y el detalle muestran la foto si existe.

Resetear datos / depuración:
- Para borrar todos los contactos: abrir DevTools → Application → Local Storage → eliminar la clave "contactos_v1".
- También puedes eliminar contactos desde la UI (botón eliminar).

Notas técnicas:
- Páginas implementadas como Standalone Components (Ionic + Angular).
- Formulario usa ReactiveFormsModule; campos obligatorios: nombre y apellido.
- Servicio usa localStorage y BehaviorSubject para actualizar la UI en tiempo real.

Mejoras posibles:
- Usar la cámara/galería nativa con Capacitor para tomar fotos en móvil.
- Guardar fotos en IndexedDB o backend en vez de localStorage.
- Reemplazar confirm() por modales de Ionic para una mejor UX.

Contacto:
- Si deseas que integre alguna mejora específica, dime cuál y la implemento.