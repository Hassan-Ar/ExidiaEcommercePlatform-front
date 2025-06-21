import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ConfigStateService } from '@abp/ng.core';

@Injectable({ providedIn: 'root' })
export class LandingGuard implements CanActivate {
  constructor(private config: ConfigStateService, private router: Router) {}

  canActivate(): boolean {
    const user: any = this.config.getDeep('currentUser');
    const roles: string[] = user?.roles ?? [];
    const isAuth = user?.isAuthenticated;

    if (isAuth && roles.includes('ShopAdmin')) {
      // Redirect admin users to admin dashboard
      this.router.navigateByUrl('/admin');
    } else {
      // Redirect non-admin users (or not logged in) to store
      this.router.navigateByUrl('/store');
    }
    return false;
  }
} 