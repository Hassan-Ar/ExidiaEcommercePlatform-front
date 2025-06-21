import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigStateService } from '@abp/ng.core';

@Component({
  selector: 'app-welcome',
  template: `
    <div class="welcome-container">
      <div class="welcome-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <h2>Welcome to EcommercePlatform</h2>
        <p>Redirecting you to the right place...</p>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .welcome-content {
      max-width: 400px;
      padding: 40px;
    }

    .loading-spinner {
      margin-bottom: 30px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    h2 {
      font-size: 28px;
      margin-bottom: 15px;
      font-weight: 300;
    }

    p {
      font-size: 16px;
      opacity: 0.9;
    }
  `]
})
export class WelcomeComponent implements OnInit {

  constructor(
    private config: ConfigStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Small delay for better UX, then redirect
    setTimeout(() => {
      this.redirectUser();
    }, 1000);
  }

  private redirectUser(): void {
    const user: any = this.config.getDeep('currentUser');
    const roles: string[] = user?.roles ?? [];
    const isAuth = user?.isAuthenticated;

    if (isAuth && roles.includes('ShopAdmin')) {
      this.router.navigateByUrl('/admin');
    } else {
      this.router.navigateByUrl('/store');
    }
  }
}