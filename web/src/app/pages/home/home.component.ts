import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  alias: string = "";

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router)
  constructor() {
    const token = this.authService.token;
    if (!token) {
      this.router.navigate(["/sign-up"])
      return;
    }
    const { alias } = JSON.parse(atob(token!.split(".")[1]))
    this.alias = alias;
  }
}
