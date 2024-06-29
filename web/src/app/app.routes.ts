import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: "sign-in/otp",
    loadComponent: () => import("./pages/otp/otp.component").then(m => m.OtpComponent)
  },
  {
    path: "sign-in",
    component: LoginComponent,
  },
  {
    path: "sign-up",
    loadComponent: () => import("./pages/sign-up/sign-up.component").then(m => m.SignUpComponent)
  },
  {
    path: "smlv",
    loadComponent: () => import("./shared/layout/layout.component").then(m => m.LayoutComponent),
    children: [
      {
        path: "home",
        loadComponent: () => import("./pages/home/home.component").then(m => m.HomeComponent)
      },
      {
        path: "menu",
        loadComponent: () => import("./pages/menu/menu.component").then(m => m.MenuComponent)
      },
      {
        path: "**",
        redirectTo: "home"
      }
    ]

  },
  {
    path: "**",
    redirectTo: "sign-in"
  }
];
