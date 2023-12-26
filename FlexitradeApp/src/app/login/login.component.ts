import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ModalOverlayRef } from '../overlay/modaloverlayref';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  errorMessage = "";
  savedUsername = this.authService.getUsername();
  form: FormGroup = this.formBuilder.group({
    username: [this.savedUsername, Validators.required],
    password: ['', Validators.required],
    rememberMe: [this.savedUsername !== null]
  });
  showPassword: boolean = false;
  loading = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private ref: ModalOverlayRef) { }

  ngOnInit() {
  }

  login() {
    try {
      this.loading = true;
      const username = this.form.controls['username'].value;
      const password = this.form.controls['password'].value;
      const rememberMe = this.form.controls['rememberMe'].value;

      this.authService.login(username, password).subscribe({
        next: response => {
          this.authService.saveToken(response);
          if (rememberMe) {
            this.authService.saveUsername(username);
          } else {
            this.authService.deleteUsername();
          }
          this.loading = false;
          this.authService.setIsLoggedIn();
          this.router.navigate(['/']);
          this.close("login successful");
        },
        error: errorResponse => {
          this.loading = false;
          if (errorResponse.status === 400) {
            this.errorMessage = errorResponse.error.cause;
            console.log('User or password invalid');
          } else if (errorResponse.status === 403) {
            this.errorMessage = errorResponse.error.cause;
          }
        },

      });
    } catch (error) {
      this.loading = false;
      console.log(error);
      if (error instanceof Error) this.errorMessage = error.message
      else this.errorMessage = String(error)
    }
  }

  close(value: string) {
    this.ref.close(value);
  }
}
