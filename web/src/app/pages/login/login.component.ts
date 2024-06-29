import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputValidator } from '../../shared/model';


@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgIf, InputComponent, ButtonComponent],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  credentials: { email: string, password: string } = {
    email: "",
    password: ""
  };

  isLoading = false;


  private loginService: LoginService = inject(LoginService)
  private authService: AuthService = inject(AuthService)
  private toastService: ToastrService = inject(ToastrService)
  private router: Router = inject(Router);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef)

  ngOnInit(): void {
    if (this.authService.token) {
      this.router.navigate(["/smlv/home"])

    }
  }

  login() {
    this.isLoading = true;
    this.loginService.signIn({ ...this.credentials }).subscribe({
      next: (value) => {
        const { otp, token } = value;
        if (otp === true) {
          this.isLoading = false;
          sessionStorage.setItem("credential_email", this.credentials.email)
          this.router.navigate(["/sign-in/otp"])
          return;
        }
        this.authService.token = token as string;
        this.router.navigate(["/smlv/home"])
      },
      error: () => {
        this.credentials = { email: "", password: "" };
        this.toastService.error("Try again.", "Login Error", {
          timeOut: 3000,
          positionClass: "toast-bottom-center",
          tapToDismiss: true,
          progressAnimation: "increasing"
        })
        this.isLoading = false;
        this.cd.detectChanges()
      },
    })

  }

}
