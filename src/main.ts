import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth/auth.interceptor';

export function tokenGetter() {
  return sessionStorage.getItem('access_token');
}

const appConfig ={
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:3000"],
          disallowedRoutes: ["localhost:3000/api/auth/login"]
        }
      })
    ),
    provideRouter(routes),
  ],
}
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
