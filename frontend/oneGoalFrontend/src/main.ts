import { importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { UsersFeature } from './app/user/store/reducer/user.reducer';
import { UsersEffects } from './app/user/store/effects/users.effects';
import { UserService } from './app/services/user.service';

bootstrapApplication(AppComponent,
  {
  providers:[
    importProvidersFrom(BrowserModule, HttpClientModule, StoreModule.forRoot({}), EffectsModule.forRoot(), StoreModule.forFeature(UsersFeature), EffectsModule.forFeature([UsersEffects])),
    provideStore(),
    provideRouter(routes),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(),
    provideAnimations(),
    UserService,

],


}
).catch((err) => console.error(err));
