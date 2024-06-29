import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputComponent } from '../../shared/input/input.component';
import { InputValidator } from '../../shared/model';
import { Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements OnInit {
  otp = {
    value: "",
    valid: false
  }
  isLoading: boolean = false;

  otpValidator: InputValidator[] = [
    {
      validator: Validators.required,
      onError: (err) => null
    },
    {
      validator: Validators.pattern(/^[0-9]{5}$/),
      onError: (err) => null
    },
  ]


  private loginService: LoginService = inject(LoginService)
  private authService: AuthService = inject(AuthService)
  private toastService: ToastrService = inject(ToastrService)
  private router: Router = inject(Router);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef)

  private email: string = "";

  async ngOnInit() {
    const email = sessionStorage.getItem("credential_email")
    if (!email) {
      this.router.navigate(["/sign-in"])
      return;
    }
    this.email = email
    const isOtp = await this.loginService.isOtp({ email: this.email })

    if (!isOtp) {
      this.router.navigate(["/sign-in"])
    }


  }
  handleKeyPress(event: any) {
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  formatEmail() {
    if (!this.email) {
      return "";

    }
    const parts = this.email.split("@");
    return `${parts[0][0]}${new Array(parts[0].length - 1).fill("*").join("")}@${new Array(parts[1].length - 1).fill("*").join("")}${parts[1][parts[1].length - 1]}`
  }




  validateOtp() {
    this.isLoading = true;
    this.loginService.otp({ otpValue: this.otp.value, email: this.email }).subscribe({
      next: (body) => {
        const { token } = body;
        this.authService.token = token as string;
        sessionStorage.removeItem("credential_email")
        this.router.navigate(["/smlv/home"])
      },
      error: () => {
        this.toastService.error("Try again.", "Login Error", {
          timeOut: 3000,
          positionClass: "toast-bottom-center",
          tapToDismiss: true,
          progressAnimation: "increasing"
        })
        this.otp.value = ""
        this.otp.valid = false
        this.isLoading = false;
        console.log(this.otp);

        this.cd.detectChanges()
      },
    })
  }
}
