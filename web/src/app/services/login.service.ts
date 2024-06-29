import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { environment } from '../../environments/environment';

interface SignUp {
  token?: string
  otp?: boolean
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private http: HttpClient = inject(HttpClient);

  constructor() { }

  signIn({ email, password }: { email: string, password: string }): Observable<SignUp> {
    return this.http.post<SignUp>(`${environment.api}/login/sign-in`, {
      email, password
    })
  }


  otp({ otpValue, email }: { otpValue: string, email: string }) {
    return this.http.post<SignUp>(`${environment.api}/login/otp`, {
      otpValue, email
    })
  }

  isOtp({ email }: { email: string }) {
    const observable = this.http.get(`${environment.api}/login/otp?email=${email}`, {
      observe: "response"
    }).pipe(map(res => res.status === 200));

    return firstValueFrom(observable)
  }

  validateInvitedToken({ invitedToken }: { invitedToken: string }) {
    const observable = this.http.get(`${environment.api}/login/sign-up/validate?invitedToken=${invitedToken}`, {
      observe: "response"
    }).pipe(map(res => res.status === 200))
    return firstValueFrom(observable)
  }

  signUp({ user, invitedToken }: { user: any, invitedToken: string }) {
    return this.http.post<SignUp>(`${environment.api}/login/sign-up`, {
      user, invitedToken
    }, { observe: "response" }).pipe(map(res => res.body ?? { token: undefined }), catchError(() => of({ token: undefined })))
  }
}
