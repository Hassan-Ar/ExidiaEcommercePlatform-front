import { Component } from '@angular/core';

@Component({
  selector: 'app-store-footer',
  template: `
    <footer class="bg-dark text-light mt-5">
      <!-- Newsletter Subscription -->
      <div class="py-4 border-bottom border-secondary">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6">
              <h5 class="mb-2">
                <i class="fas fa-envelope me-2"></i>Subscribe to Newsletter
              </h5>
              <p class="mb-0 text-muted">Get the latest updates on new products and upcoming offers</p>
            </div>
            <div class="col-md-6">
              <div class="input-group">
                <input type="email" class="form-control" placeholder="Enter your email address">
                <button class="btn btn-primary" type="submit">
                  <i class="fas fa-paper-plane me-1"></i>Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Footer Content -->
      <div class="py-5">
        <div class="container">
          <div class="row">
            <!-- Information -->
            <div class="col-lg-3 col-md-6 mb-4">
              <h6 class="text-uppercase fw-bold mb-3">Information</h6>
              <ul class="list-unstyled mb-0">
                <li><a href="#" class="text-light text-decoration-none">About Us</a></li>
                <li><a href="#" class="text-light text-decoration-none">Delivery Information</a></li>
                <li><a href="#" class="text-light text-decoration-none">Privacy Policy</a></li>
                <li><a href="#" class="text-light text-decoration-none">Terms & Conditions</a></li>
                <li><a href="#" class="text-light text-decoration-none">Contact Us</a></li>
                <li><a href="#" class="text-light text-decoration-none">Site Map</a></li>
              </ul>
            </div>

            <!-- Customer Service -->
            <div class="col-lg-3 col-md-6 mb-4">
              <h6 class="text-uppercase fw-bold mb-3">Customer Service</h6>
              <ul class="list-unstyled mb-0">
                <li><a href="#" class="text-light text-decoration-none">Search</a></li>
                <li><a href="#" class="text-light text-decoration-none">Returns</a></li>
                <li><a href="#" class="text-light text-decoration-none">Gift Certificates</a></li>
                <li><a href="#" class="text-light text-decoration-none">Affiliate</a></li>
                <li><a href="#" class="text-light text-decoration-none">Specials</a></li>
              </ul>
            </div>

            <!-- My Account -->
            <div class="col-lg-3 col-md-6 mb-4">
              <h6 class="text-uppercase fw-bold mb-3">My Account</h6>
              <ul class="list-unstyled mb-0">
                <li><a href="#" class="text-light text-decoration-none">My Account</a></li>
                <li><a href="#" class="text-light text-decoration-none">Order History</a></li>
                <li><a href="#" class="text-light text-decoration-none">Wish List</a></li>
                <li><a href="#" class="text-light text-decoration-none">Newsletter</a></li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div class="col-lg-3 col-md-6 mb-4">
              <h6 class="text-uppercase fw-bold mb-3">Contact Info</h6>
              <ul class="list-unstyled mb-0">
                <li class="mb-2">
                  <i class="fas fa-map-marker-alt me-2"></i>
                  123 Store Street, City, State 12345
                </li>
                <li class="mb-2">
                  <i class="fas fa-phone me-2"></i>
                  +1 (555) 123-4567
                </li>
                <li class="mb-2">
                  <i class="fas fa-envelope me-2"></i>
                  info&#64;myshop.com
                </li>
              </ul>
              
              <!-- Social Media Links -->
              <div class="mt-3">
                <h6 class="text-uppercase fw-bold mb-2">Follow Us</h6>
                <a href="#" class="text-light me-3"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="text-light me-3"><i class="fab fa-twitter"></i></a>
                <a href="#" class="text-light me-3"><i class="fab fa-instagram"></i></a>
                <a href="#" class="text-light me-3"><i class="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="bg-black py-3">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6">
              <p class="mb-0 text-muted">© 2025 MyShop. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-end">
              <p class="mb-0 text-muted">
                Powered by 
                <a href="#" class="text-primary text-decoration-none">MyShop Platform</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
    }
    
    .border-bottom {
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    
    footer a {
      color: rgba(255, 255, 255, 0.8) !important;
      transition: all 0.3s ease;
      position: relative;
    }
    
    footer a:hover {
      color: #ffd93d !important;
      transform: translateX(5px);
    }
    
    footer a::before {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 0;
      background: linear-gradient(45deg, #ffd93d, #ff6b6b);
      transition: width 0.3s ease;
    }
    
    footer a:hover::before {
      width: 100%;
    }
    
    .fab, .fas {
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }
    
    .fab:hover, .fas:hover {
      transform: translateY(-3px) scale(1.1);
      color: #ffd93d !important;
    }
    
    h5, h6 {
      background: linear-gradient(45deg, #ffd93d, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
    
    .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      border-radius: 25px 0 0 25px;
      padding: 12px 20px;
    }
    
    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .form-control:focus {
      background: rgba(255, 255, 255, 0.2);
      border-color: #ffd93d;
      box-shadow: 0 0 0 0.2rem rgba(255, 217, 61, 0.25);
      color: white;
    }
    
    .btn-primary {
      background: linear-gradient(45deg, #ffd93d, #ff6b6b);
      border: none;
      border-radius: 0 25px 25px 0;
      padding: 12px 25px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
    }
    
    .bg-black {
      background: rgba(0, 0, 0, 0.3) !important;
      backdrop-filter: blur(10px);
    }
    
    /* Social media icons specific styling */
    .fab {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
    
    .fab:hover {
      background: rgba(255, 217, 61, 0.2);
      transform: translateY(-3px) rotate(5deg);
    }
    
    /* Newsletter subscription enhancement */
    .input-group {
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      border-radius: 25px;
      overflow: hidden;
    }
    
    /* Responsive improvements */
    @media (max-width: 768px) {
      footer {
        text-align: center;
      }
      
      footer a {
        display: block;
        margin: 5px 0;
      }
      
      .fab {
        margin: 5px;
      }
    }
  `]
})
export class StoreFooterComponent {} 