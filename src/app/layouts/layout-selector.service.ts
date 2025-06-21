import { Injectable } from '@angular/core';
import { ConfigStateService } from '@abp/ng.core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

export interface LayoutInfo {
  isAdminLayout: boolean;
  isPublicLayout: boolean;
  isStoreLayout: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutSelectorService {
  private currentLayout$ = new BehaviorSubject<LayoutInfo>({
    isAdminLayout: false,
    isPublicLayout: true,
    isStoreLayout: false
  });

  constructor(
    private config: ConfigStateService,
    private router: Router
  ) {
    this.initializeLayoutDetection();
  }

  getLayoutInfo(): Observable<LayoutInfo> {
    return this.currentLayout$.asObservable();
  }

  private initializeLayoutDetection(): void {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.determineLayout())
    ).subscribe(layout => {
      this.currentLayout$.next(layout);
    });

    // Initial layout determination
    setTimeout(() => {
      const layout = this.determineLayout();
      this.currentLayout$.next(layout);
    }, 100);
  }

  private determineLayout(): LayoutInfo {
    const currentUrl = this.router.url;
    
    // Check if user is on admin routes
    if (currentUrl.startsWith('/admin')) {
      return {
        isAdminLayout: this.isUserAdmin(),
        isPublicLayout: false,
        isStoreLayout: false
      };
    }

    // Check if user is on store routes
    if (currentUrl.startsWith('/store')) {
      return {
        isAdminLayout: false,
        isPublicLayout: false,
        isStoreLayout: true
      };
    }

    // Default to public layout for other routes
    return {
      isAdminLayout: false,
      isPublicLayout: true,
      isStoreLayout: false
    };
  }

  private isUserAdmin(): boolean {
    const user: any = this.config.getDeep('currentUser');
    const roles: string[] = user?.roles ?? [];
    const isAuth = user?.isAuthenticated;
    return isAuth && roles.includes('ShopAdmin');
  }

  isCurrentUserAdmin(): boolean {
    return this.isUserAdmin();
  }
}