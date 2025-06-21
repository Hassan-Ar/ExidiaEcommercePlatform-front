import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigStateService, AuthService } from '@abp/ng.core';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { CartStateService } from '../storefront/shared/cart-state.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  template: `
    <div class="admin-dashboard-layout">
      <!-- Top Navigation Bar -->
      <nav class="admin-navbar">
        <div class="admin-navbar-content">
          <div class="navbar-left">
            <button class="sidebar-toggle" (click)="toggleSidebar()">
              <i class="fas fa-bars"></i>
            </button>
            <div class="navbar-brand">
              <i class="fas fa-store"></i>
              <span>Admin Dashboard</span>
            </div>
          </div>
          
          <div class="navbar-right">
            <div class="user-menu">
              <div class="user-info">
                <span class="user-name">{{ userName }}</span>
                <span class="user-role">Shop Admin</span>
              </div>
              <div class="user-actions">
                <button class="btn-icon" title="View Store" (click)="goToStore()">
                  <i class="fas fa-store"></i>
                </button>
                <button class="btn-icon" title="Account Settings" (click)="goToSettings()">
                  <i class="fas fa-cog"></i>
                </button>
                <button class="btn-icon" title="Logout" (click)="logout()">
                  <i class="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Sidebar -->
      <aside class="admin-sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-content">
          <nav class="sidebar-nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/dashboard" routerLinkActive="active">
                  <i class="fas fa-chart-line"></i>
                  <span class="nav-text">Dashboard</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/products" routerLinkActive="active">
                  <i class="fas fa-box"></i>
                  <span class="nav-text">Products</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/categories" routerLinkActive="active">
                  <i class="fas fa-tags"></i>
                  <span class="nav-text">Categories</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/orders" routerLinkActive="active">
                  <i class="fas fa-shopping-cart"></i>
                  <span class="nav-text">Orders</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-main" [class.sidebar-collapsed]="sidebarCollapsed">
        <div class="main-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-dashboard-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* Top Navigation */
    .admin-navbar {
      background: #1e293b;
      color: white;
      height: 60px;
      border-bottom: 1px solid #334155;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .admin-navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 20px;
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .sidebar-toggle {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .sidebar-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 600;
    }

    .navbar-right {
      display: flex;
      align-items: center;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-info {
      text-align: right;
    }

    .user-name {
      display: block;
      font-weight: 500;
      font-size: 14px;
    }

    .user-role {
      display: block;
      font-size: 12px;
      color: #94a3b8;
    }

    .user-actions {
      display: flex;
      gap: 10px;
    }

    .btn-icon {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .btn-icon:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    /* Sidebar */
    .admin-sidebar {
      position: fixed;
      top: 60px;
      left: 0;
      width: 250px;
      height: calc(100vh - 60px);
      background: #0f172a;
      border-right: 1px solid #334155;
      transition: transform 0.3s ease;
      z-index: 999;
    }

    .admin-sidebar.collapsed {
      transform: translateX(-200px);
      width: 50px;
    }

    .sidebar-content {
      height: 100%;
      overflow-y: auto;
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      margin-bottom: 5px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #cbd5e1;
      text-decoration: none;
      padding: 12px 20px;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .nav-link.active {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-left-color: #3b82f6;
    }

    .nav-link i {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }

    .nav-text {
      font-weight: 500;
      transition: opacity 0.3s;
    }

    .admin-sidebar.collapsed .nav-text {
      opacity: 0;
    }

    /* Main Content */
    .admin-main {
      margin-left: 250px;
      margin-top: 60px;
      min-height: calc(100vh - 60px);
      transition: margin-left 0.3s ease;
    }

    .admin-main.sidebar-collapsed {
      margin-left: 50px;
    }

    .main-content {
      padding: 20px;
      height: calc(100vh - 80px);
      overflow-y: auto;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .admin-sidebar {
        transform: translateX(-100%);
      }

      .admin-sidebar.collapsed {
        transform: translateX(-100%);
      }

      .admin-main {
        margin-left: 0;
      }

      .admin-main.sidebar-collapsed {
        margin-left: 0;
      }

      .user-info {
        display: none;
      }
    }
  `]
})
export class AdminDashboardLayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  userName = '';
  private destroy$ = new Subject<void>();

  constructor(
    private config: ConfigStateService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartStateService
  ) {}

  ngOnInit(): void {
    // Get user name
    const user: any = this.config.getDeep('currentUser');
    this.userName = user?.userName || user?.name || 'Admin';

    // Handle responsive sidebar
    this.handleResponsiveSidebar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  goToStore(): void {
    this.router.navigate(['/store']);
  }

  goToSettings(): void {
    this.router.navigate(['/setting-management']);
  }

  logout(): void {
    // Clear cart on logout (same as store header)
    this.cartService.onLogout();
    
    // Perform logout
    try {
      this.authService.logout();
      // After logout, redirect to store
      setTimeout(() => {
        this.router.navigate(['/store']);
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, redirect to store for better UX
      this.router.navigate(['/store']);
    }
  }

  private handleResponsiveSidebar(): void {
    if (window.innerWidth <= 768) {
      this.sidebarCollapsed = true;
    }
  }
}