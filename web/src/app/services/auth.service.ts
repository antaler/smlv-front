import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly TOKEN_KEY: string = "_tkn"
  private _token: string | null = null;

  public set token(token: string | null) {
    this._token = token;
    if (token === null) {
      sessionStorage.removeItem(AuthService.TOKEN_KEY)
    } else {
      sessionStorage.setItem(AuthService.TOKEN_KEY, token)
    }
  }

  public get token(): string | null {
    if (!this._token) {
      const tokenStoraged = sessionStorage.getItem(AuthService.TOKEN_KEY);
      if (tokenStoraged) {
        this._token = tokenStoraged
      }
    }
    return this._token;
  }



  constructor() { }

}
