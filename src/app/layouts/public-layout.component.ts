import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  template: `
    <!-- Simple public layout for admin and other pages -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-3">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary" routerLink="/">
          <i class="fas fa-store me-2"></i>MyShop
        </a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/store">
            <i class="fas fa-shopping-cart me-1"></i>Go to Store
          </a>
        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>

    <footer class="text-center py-4 bg-light mt-5">
      <div class="container">
        <p class="mb-0 text-muted">© 2025 MyShop. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [
    `
    .navbar-brand {
      color: #007bff !important;
    }
    
    .nav-link {
      font-weight: 500;
      color: #495057 !important;
      transition: color 0.3s ease;
    }
    
    .nav-link:hover {
      color: #007bff !important;
    }
    `,
  ],
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'store-shell');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'store-shell');
  }
} 