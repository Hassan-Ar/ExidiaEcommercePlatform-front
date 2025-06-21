import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../proxy/products/product.service';

@Component({
  selector: 'app-product-catalog',
  template: `
    <div class="container py-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" class="text-decoration-none">Home</a></li>
          <li class="breadcrumb-item active" aria-current="page">Products</li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="row align-items-center mb-4">
        <div class="col-md-6">
          <h1 class="h2 mb-0">Products</h1>
          <p class="text-muted mb-0">{{ products.length }} items found</p>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end align-items-center">
            <!-- Sort By -->
            <div class="me-3">
              <label class="form-label me-2 mb-0">Sort by:</label>
              <select class="form-select form-select-sm" style="width: auto;">
                <option>Name: A to Z</option>
                <option>Name: Z to A</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Created on</option>
              </select>
            </div>
            
            <!-- View Mode -->
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-outline-secondary btn-sm active">
                <i class="fas fa-th"></i>
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Products -->
      <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-lg-3 mb-4">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h6 class="mb-0"><i class="fas fa-filter me-2"></i>Filters</h6>
            </div>
            <div class="card-body">
              <!-- Category Filter -->
              <div class="mb-4">
                <h6 class="fw-bold">Category</h6>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat1">
                  <label class="form-check-label" for="cat1">Electronics</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat2">
                  <label class="form-check-label" for="cat2">Computers</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat3">
                  <label class="form-check-label" for="cat3">Clothing</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="cat4">
                  <label class="form-check-label" for="cat4">Books</label>
                </div>
              </div>

              <!-- Price Range -->
              <div class="mb-4">
                <h6 class="fw-bold">Price Range</h6>
                <div class="row g-2">
                  <div class="col-6">
                    <input type="number" class="form-control form-control-sm" placeholder="Min">
                  </div>
                  <div class="col-6">
                    <input type="number" class="form-control form-control-sm" placeholder="Max">
                  </div>
                </div>
                <button class="btn btn-outline-primary btn-sm mt-2 w-100">Apply</button>
              </div>

              <!-- Manufacturer -->
              <div class="mb-4">
                <h6 class="fw-bold">Manufacturer</h6>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="brand1">
                  <label class="form-check-label" for="brand1">Apple</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="brand2">
                  <label class="form-check-label" for="brand2">Samsung</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="brand3">
                  <label class="form-check-label" for="brand3">Microsoft</label>
                </div>
              </div>

              <!-- Availability -->
              <div class="mb-4">
                <h6 class="fw-bold">Availability</h6>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="avail1">
                  <label class="form-check-label" for="avail1">In Stock</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="avail2">
                  <label class="form-check-label" for="avail2">Out of Stock</label>
                </div>
              </div>

              <button class="btn btn-outline-secondary btn-sm w-100">Clear Filters</button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="col-lg-9">
          <div class="row g-4">
            <div class="col-sm-6 col-md-4" *ngFor="let p of products">
              <div class="product-card h-100">
                <div class="product-image-wrapper">
                  <img [src]="p.imageUrl || 'https://via.placeholder.com/300x300?text=' + p.name" 
                       class="product-image" [alt]="p.name" />
                  
                  <!-- Product badges -->
                  <div class="product-badges">
                    <span class="badge bg-success" *ngIf="p.isNew">New</span>
                    <span class="badge bg-danger" *ngIf="p.isOnSale">Sale</span>
                  </div>

                  <!-- Product actions -->
                  <div class="product-actions">
                    <button class="btn btn-sm btn-outline-primary" title="Add to Wishlist">
                      <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" title="Quick View">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" title="Compare">
                      <i class="fas fa-balance-scale"></i>
                    </button>
                  </div>
                </div>

                <div class="product-info">
                  <h6 class="product-title">
                    <a href="#" class="text-decoration-none text-dark">{{ p.name }}</a>
                  </h6>
                  
                  <!-- Rating -->
                  <div class="product-rating mb-2">
                    <div class="rating">
                      <i class="fas fa-star" *ngFor="let star of [1,2,3,4,5]"></i>
                    </div>
                    <small class="text-muted">({{ p.reviewCount || 0 }} reviews)</small>
                  </div>

                  <p class="product-description text-muted small">
                    {{ p.shortDescription || 'Premium quality product with excellent features and great value for money.' }}
                  </p>

                  <div class="product-price mb-3">
                    <span class="current-price fw-bold text-success">{{ p.price | currency }}</span>
                    <span class="original-price text-muted text-decoration-line-through ms-2" *ngIf="p.originalPrice">
                      {{ p.originalPrice | currency }}
                    </span>
                  </div>

                  <div class="product-actions-bottom">
                    <button class="btn btn-primary btn-sm flex-fill" (click)="addToCart(p)">
                      <i class="fas fa-cart-plus me-1"></i>Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <nav aria-label="Products pagination" class="mt-5">
            <ul class="pagination justify-content-center">
              <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1">Previous</a>
              </li>
              <li class="page-item active">
                <a class="page-link" href="#">1</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">2</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">3</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .product-image-wrapper {
      position: relative;
      overflow: hidden;
      height: 250px;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
    }

    .product-badges .badge {
      margin-right: 5px;
    }

    .product-actions {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .product-actions {
      opacity: 1;
    }

    .product-info {
      padding: 1.25rem;
    }

    .product-title {
      font-weight: 600;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .product-title a:hover {
      color: #007bff !important;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rating {
      color: #ffc107;
      font-size: 0.875rem;
    }

    .product-description {
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .current-price {
      font-size: 1.1rem;
    }

    .product-actions-bottom {
      display: flex;
      gap: 0.5rem;
    }

    /* Breadcrumb styling */
    .breadcrumb {
      background: none;
      padding: 0;
    }

    .breadcrumb-item + .breadcrumb-item::before {
      content: ">";
      color: #6c757d;
    }

    /* Filter card styling */
    .card-header {
      border-bottom: none;
    }

    .form-check {
      margin-bottom: 0.5rem;
    }

    .form-check-label {
      font-size: 0.9rem;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .product-image-wrapper {
        height: 200px;
      }
      
      .product-actions {
        opacity: 1;
      }
    }
  `]
})
export class ProductCatalogComponent implements OnInit {
  products: any[] = [];
  
  constructor(private productService: ProductService) {}
  
  ngOnInit() {
    this.productService
      .getList({ skipCount: 0, maxResultCount: 1000 })
      .subscribe((r: any) => (this.products = Array.isArray(r) ? r : r.items ?? []));
  }

  addToCart(product: any) {
    // TODO: integrate with cart service
    alert('Added to cart: ' + product.name);
  }
} 