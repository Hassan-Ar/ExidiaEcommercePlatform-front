import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-storefront-layout',
  template: `
    <!-- Creative Top notification bar -->
    <div class="creative-notification-bar">
      <div class="notification-content">
        <div class="notification-icon">🚀</div>
        <div class="notification-text">
          <strong>Limited Time Offer:</strong> Get FREE shipping on orders over $50 + 20% off your first purchase!
        </div>
        <a href="#" class="notification-cta">Shop Now</a>
      </div>
      <button type="button" class="notification-close" onclick="this.parentElement.style.display='none'">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <app-store-header></app-store-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-store-footer></app-store-footer>
  `,
  styles: [`
    .store-navbar { 
      position: sticky; 
      top: 0; 
      z-index: 1030; 
    }
    
    .main-content {
      min-height: calc(100vh - 200px);
    }
    
    /* Creative Notification Bar */
    .creative-notification-bar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 0;
      position: relative;
      overflow: hidden;
      animation: slideDown 0.5s ease-out;
    }
    
    .creative-notification-bar::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #ffd93d, transparent);
      animation: shimmer 2s infinite;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .notification-icon {
      font-size: 1.2rem;
      animation: bounce 2s infinite;
    }
    
    .notification-text {
      font-weight: 500;
      text-align: center;
    }
    
    .notification-cta {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .notification-cta:hover {
      background: white;
      color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .notification-close {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .notification-close:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-50%) rotate(90deg);
    }
    
    /* Animations */
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-5px);
      }
      60% {
        transform: translateY(-3px);
      }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .notification-content {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
      
      .notification-text {
        font-size: 0.9rem;
      }
    }
  `]
})
export class StorefrontLayoutComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(document.body, 'store-shell');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'store-shell');
  }
} 