import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
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
    private authService: AuthService) { }

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
        }, error: errorResponse => {
          this.loading = false;
          if (errorResponse.error === 400) {
            console.log('User or password invalid');
          }
        },
      });
    } catch (e) {
      console.log(e);
      this.loading = false;
    }
  }
}
