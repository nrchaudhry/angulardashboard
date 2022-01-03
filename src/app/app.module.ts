import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { HttpModule, RequestOptions } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RequestOptionsService } from './services/setting.headers';
import { HttpErrorInterceptor } from './services/http-error.interceptor';

@NgModule({
  declarations: [AppComponent, LoginComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    HttpClientModule,
    HttpModule,
    LoadingBarHttpModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    LoadingBarModule.forRoot(),
    SweetAlert2Module.forRoot(),
    NgxSpinnerModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: RequestOptions,
      useClass: RequestOptionsService,
    },
    // AuthGuardService,
    DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
