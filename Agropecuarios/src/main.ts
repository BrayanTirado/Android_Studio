import './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personAddOutline,
  logInOutline,
  homeOutline,
  logOutOutline,
  settingsOutline,
  logoGoogle
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

addIcons({
  'person-add-outline': personAddOutline,
  'log-in-outline': logInOutline,
  'home-outline': homeOutline,
  'log-out-outline': logOutOutline,
  'settings-outline': settingsOutline,
  'logo-google': logoGoogle,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});

defineCustomElements(window);
