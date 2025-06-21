import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ConfigStateService } from '@abp/ng.core';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private config: ConfigStateService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user: any = this.config.getDeep('currentUser');
    const roles: string[] = user?.roles ?? [];
    const isAuth = user?.isAuthenticated;

    if (isAuth && roles.includes('ShopAdmin')) {
      return true;
    }
    
    // If not admin, redirect to store
    this.router.navigate(['/store']);
    return false;
  }
}