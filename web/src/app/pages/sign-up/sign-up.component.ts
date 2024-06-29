import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputComponent } from '../../shared/input/input.component';
import { InputValidator } from '../../shared/model';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';


function onErrorRequired(err: any) {
  const { required } = err;

  return required ? "The field is mandatory" : null
}

function onErrorMinMax(type: "min" | "max") {
  const isMin = type === "min"
  const key = isMin ? "minlength" : "maxlength"
  const literal = isMin ? "minimuin" : "maximun"
  return (err: { minlength: any, maxlength: any }) => {
    const error = err[key];
    if (!error) {
      return null
    }
    const { requiredLength } = error
    return `The ${literal} length is ${requiredLength}`;
  }
}



interface FormValidators {
  alias: InputValidator[],
  email: InputValidator[],
  password: InputValidator[]
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  private readonly aRouter = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly loginService: LoginService = inject(LoginService)
  private readonly authService: AuthService = inject(AuthService)
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef)

  readonly validators: FormValidators = {
    alias: [
      {
        validator: Validators.required,
        onError: onErrorRequired
      },
      {
        validator: Validators.minLength(3),
        onError: onErrorMinMax("min")
      },
      {
        validator: Validators.maxLength(30),
        onError: onErrorMinMax("max")
      }
    ],
    email: [],
    password: [
      {
        validator: Validators.required,
        onError: onErrorRequired
      },
      {
        validator: Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$&*?_\\-\s])(?=.*[0-9])(?=.*[a-z]).{8}$/),
        onError: (err) => {
          const { pattern } = err
          if (!pattern) {
            return null;
          }

          return 'The password is not valid '
        }

      }
    ]
  }

  user = {
    alias: {
      value: "",
      valid: false
    },
    email: {
      value: "",
      valid: true
    },
    password: {
      value: "",
      valid: false
    }
  }

  private invitedToken = "";

  constructor() {
    this.aRouter.queryParams.subscribe({
      next: async ({ invitedToken }) => {
        if (!invitedToken) {
          this.router.navigate(["/sign-in"])
        }
        const isOk = await this.loginService.validateInvitedToken({ invitedToken })
        if (!isOk) {
          this.router.navigate(["/sign-in"])
        }
        this.invitedToken = invitedToken
        console.log(invitedToken.split(".")[1]);

        const jsonString = atob(invitedToken.split(".")[1])
        console.log(jsonString);

        const { emailTarget } = JSON.parse(jsonString)
        this.user.email.value = emailTarget
        this.cdr.detectChanges()

      }
    })
  }

  handleClickSignIn(event: MouseEvent) {
    event.preventDefault()
    const { email: { value: email }, password: { value: password }, alias: { value: alias } } = this.user;
    this.loginService
      .signUp({
        user: {
          email,
          password,
          alias
        }, invitedToken: this.invitedToken
      })
      .subscribe({
        next: ({ token }) => {
          if (token) {
            this.authService.token = token
            this.router.navigate(["/sign-in"])
          } else {
            console.log("X");

            this.authService.token = null
            this.router.navigate(["/sign-in"])
          }
        },
        error: (err) => {
          console.log(err);

        }
      })

  }

  handleIsValid(type: "alias" | "password", isValid: boolean) {
    this.user[type].valid = isValid
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();

  }

}
