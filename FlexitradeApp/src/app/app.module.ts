import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Own components!
import { NavigationComponent } from './navigation/navigation.component';
import { SuccessComponent } from './success/success.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { OverlayComponent } from './overlay/overlay.component';


@NgModule({
  declarations: [
    AppComponent,
    OverlayComponent,
    NavigationComponent,
    LoginComponent,
    SuccessComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule.forRoot(),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
