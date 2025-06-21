import { Component } from '@angular/core';

@Component({
  selector: 'app-store-header',
  template: `
    <!-- Top bar with account links -->
    <div class="top-bar bg-dark text-light py-2">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <small>
              <i class="fas fa-phone me-2"></i>Call us: +1 (555) 123-4567
              <span class="ms-3">
                <i class="fas fa-envelope me-2"></i>info&#64;myshop.com
              </span>
            </small>
          </div>
          <div class="col-md-6 text-end">
            <small>
              <a href="#" class="text-light text-decoration-none me-3">
                <i class="fas fa-user me-1"></i>My Account
              </a>
              <a href="#" class="text-light text-decoration-none me-3">
                <i class="fas fa-heart me-1"></i>Wishlist
              </a>
              <a routerLink="/store/cart" class="text-light text-decoration-none">
                <i class="fas fa-shopping-cart me-1"></i>Shopping Cart (0)
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Main navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div class="container">
        <!-- Brand -->
        <a class="navbar-brand fw-bold fs-3 text-primary" routerLink="/store">
          <i class="fas fa-store me-2"></i>MyShop
        </a>

        <!-- Mobile toggle -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation items -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/store">Home</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Categories
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Electronics</a></li>
                <li><a class="dropdown-item" href="#">Computers</a></li>
                <li><a class="dropdown-item" href="#">Clothing</a></li>
                <li><a class="dropdown-item" href="#">Books</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">View All Categories</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">New Products</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Featured</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Contact Us</a>
            </li>
          </ul>

          <!-- Search bar -->
          <form class="d-flex me-3" style="width: 300px;">
            <div class="input-group">
              <input class="form-control" type="search" placeholder="Search products..." aria-label="Search">
              <button class="btn btn-outline-primary" type="submit">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </form>

          <!-- Cart button with badge -->
          <a routerLink="/store/cart" class="btn btn-primary position-relative">
            <i class="fas fa-shopping-cart"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              0
              <span class="visually-hidden">items in cart</span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .top-bar {
      font-size: 0.875rem;
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    }
    
    .navbar {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .navbar-brand {
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800 !important;
      font-size: 1.8rem !important;
    }
    
    .navbar-nav .nav-link {
      font-weight: 600;
      color: #2c3e50 !important;
      transition: all 0.3s ease;
      position: relative;
      margin: 0 5px;
      padding: 10px 15px !important;
      border-radius: 25px;
    }
    
    .navbar-nav .nav-link:hover {
      color: #667eea !important;
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }
    
    .dropdown-menu {
      border: none;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      border-radius: 15px;
      padding: 1rem 0;
      background: white;
    }
    
    .dropdown-item {
      padding: 10px 20px;
      transition: all 0.3s ease;
      border-radius: 10px;
      margin: 0 10px;
    }
    
    .dropdown-item:hover {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      transform: translateX(5px);
    }
    
    .form-control {
      border-radius: 25px;
      border: 2px solid #e9ecef;
      padding: 10px 20px;
      transition: all 0.3s ease;
    }
    
    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    
    .btn-outline-primary {
      border-radius: 25px;
      border: 2px solid #667eea;
      color: #667eea;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-outline-primary:hover {
      background: linear-gradient(45deg, #667eea, #764ba2);
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    
    .btn-primary {
      background: linear-gradient(45deg, #667eea, #764ba2);
      border: none;
      border-radius: 25px;
      padding: 10px 20px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      background: linear-gradient(45deg, #764ba2, #667eea);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    
    .badge {
      background: linear-gradient(45deg, #f5576c, #f093fb) !important;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
    }
    
    /* Top bar links */
    .top-bar a {
      transition: all 0.3s ease;
      position: relative;
    }
    
    .top-bar a:hover {
      color: #ffd93d !important;
      transform: translateY(-1px);
    }
    
    /* Mobile menu improvements */
    @media (max-width: 991px) {
      .navbar-collapse {
        background: white;
        border-radius: 15px;
        padding: 1rem;
        margin-top: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }
      
      .navbar-nav .nav-link {
        margin: 5px 0;
      }
    }
  `]
})
export class StoreHeaderComponent {} 