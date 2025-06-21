import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductService } from '../../proxy/products/product.service';
import { CategoryService } from '../../proxy/categories/category.service';
import { CartStateService } from '../shared/cart-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-catalog',
  template: `
    <div class="container py-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/store" class="text-decoration-none">Home</a></li>
          <li class="breadcrumb-item" *ngIf="!currentCategoryId"><a routerLink="/store/products" class="text-decoration-none">Products</a></li>
          <li class="breadcrumb-item" *ngIf="currentCategoryId"><a routerLink="/store/products" class="text-decoration-none">Products</a></li>
          <li class="breadcrumb-item active" aria-current="page" *ngIf="currentCategoryId">{{ currentCategoryName || 'Category' }}</li>
          <li class="breadcrumb-item active" aria-current="page" *ngIf="!currentCategoryId">All Products</li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="row align-items-center mb-4">
        <div class="col-md-6">
          <h1 class="h2 mb-0">{{ currentCategoryId ? (currentCategoryName || 'Category Products') : 'All Products' }}</h1>
          <p class="text-muted mb-0">{{ products.length }} items found</p>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end align-items-center">
            <!-- Sort By -->
            <div class="me-3">
              <label class="form-label me-2 mb-0">Sort by:</label>
              <select class="form-select form-select-sm" style="width: auto;" 
                      [(ngModel)]="currentSort" (ngModelChange)="onSortChange($event)">
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="created-desc">Created on</option>
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
                <div class="form-check" *ngFor="let category of categories; let i = index">
                  <input class="form-check-input" type="checkbox" 
                         [id]="'cat' + i"
                         [checked]="isCategorySelected(category.id)"
                         (change)="onCategoryChange($event, category.id)">
                  <label class="form-check-label" [for]="'cat' + i">{{ category.name }}</label>
                </div>
              </div>

              <!-- Price Range -->
              <div class="mb-4">
                <h6 class="fw-bold">Price Range</h6>
                <div class="row g-2">
                  <div class="col-6">
                    <input type="number" class="form-control form-control-sm" 
                           placeholder="Min" [(ngModel)]="priceRange.min">
                  </div>
                  <div class="col-6">
                    <input type="number" class="form-control form-control-sm" 
                           placeholder="Max" [(ngModel)]="priceRange.max">
                  </div>
                </div>
                <button class="btn btn-outline-primary btn-sm mt-2 w-100" 
                        (click)="applyPriceFilter()">Apply</button>
              </div>

              <!-- Manufacturer -->
              <div class="mb-4" *ngIf="manufacturers.length > 0">
                <h6 class="fw-bold">Manufacturer</h6>
                <div class="form-check" *ngFor="let manufacturer of manufacturers; let i = index">
                  <input class="form-check-input" type="checkbox" 
                         [id]="'brand' + i"
                         [checked]="isManufacturerSelected(manufacturer)"
                         (change)="onManufacturerChange($event, manufacturer)">
                  <label class="form-check-label" [for]="'brand' + i">{{ manufacturer }}</label>
                </div>
              </div>

              <!-- Availability -->
              <div class="mb-4">
                <h6 class="fw-bold">Availability</h6>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="avail1"
                         [checked]="isAvailabilitySelected('inStock')"
                         (change)="onAvailabilityChange($event, 'inStock')">
                  <label class="form-check-label" for="avail1">In Stock</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="avail2"
                         [checked]="isAvailabilitySelected('outOfStock')"
                         (change)="onAvailabilityChange($event, 'outOfStock')">
                  <label class="form-check-label" for="avail2">Out of Stock</label>
                </div>
              </div>

              <button class="btn btn-outline-secondary btn-sm w-100" (click)="clearFilters()">Clear Filters</button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="col-lg-9">
          <!-- Active Filters Display -->
          <div class="mb-3" *ngIf="hasActiveFilters()">
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span class="text-muted me-2">Active filters:</span>
              
              <!-- Category filters -->
              <span class="badge bg-primary" *ngFor="let categoryId of selectedCategoryIds">
                {{ getCategoryName(categoryId) }}
                <button type="button" class="btn-close btn-close-white ms-1" 
                        (click)="onCategoryFilterChange(categoryId, false)"></button>
              </span>
              
              <!-- Price range filter -->
              <span class="badge bg-primary" *ngIf="priceRange.min !== null || priceRange.max !== null">
                Price: {{ priceRange.min || 0 | currency }} - {{ priceRange.max || '∞' | currency }}
                <button type="button" class="btn-close btn-close-white ms-1" 
                        (click)="clearPriceFilter()"></button>
              </span>
              
              <!-- Manufacturer filters -->
              <span class="badge bg-primary" *ngFor="let manufacturer of selectedManufacturers">
                {{ manufacturer }}
                <button type="button" class="btn-close btn-close-white ms-1" 
                        (click)="onManufacturerFilterChange(manufacturer, false)"></button>
              </span>
              
              <!-- Availability filters -->
              <span class="badge bg-primary" *ngFor="let availability of selectedAvailability">
                {{ availability === 'inStock' ? 'In Stock' : 'Out of Stock' }}
                <button type="button" class="btn-close btn-close-white ms-1" 
                        (click)="onAvailabilityFilterChange(availability, false)"></button>
              </span>
              
              <!-- Clear all filters -->
              <button class="btn btn-outline-secondary btn-sm" (click)="clearFilters()">
                Clear All
              </button>
            </div>
          </div>
          
          <div class="row g-4">
            <div class="col-sm-6 col-md-4" *ngFor="let p of products">
              <div class="product-card h-100">
                <div class="product-image-wrapper" (click)="viewProductDetails(p.id)" style="cursor: pointer;">
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
                    <button class="btn btn-sm btn-outline-primary" title="View Details" 
                            (click)="viewProductDetails(p.id)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" title="Compare">
                      <i class="fas fa-balance-scale"></i>
                    </button>
                  </div>
                </div>

                <div class="product-info">
                  <h6 class="product-title">
                    <a [routerLink]="['/store/product', p.id]" class="text-decoration-none text-dark">{{ p.name }}</a>
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

                  <div class="product-stock mb-2">
                    <span class="badge" [class.bg-success]="p.stockQuantity > 0" [class.bg-danger]="p.stockQuantity === 0">
                      {{ p.stockQuantity > 0 ? 'In Stock (' + p.stockQuantity + ')' : 'Out of Stock' }}
                    </span>
                  </div>

                  <div class="product-actions-bottom">
                    <button class="btn btn-outline-primary btn-sm me-2" (click)="viewProductDetails(p.id)">
                      <i class="fas fa-info-circle me-1"></i>Details
                    </button>
                    <button class="btn btn-primary btn-sm flex-fill" (click)="addToCart(p)" 
                            [disabled]="p.stockQuantity === 0">
                      <i class="fas fa-cart-plus me-1"></i>{{ p.stockQuantity > 0 ? 'Add to cart' : 'Out of Stock' }}
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
export class ProductCatalogComponent implements OnInit, OnDestroy {
  products: any[] = [];
  allProducts: any[] = []; // Store all products for filtering
  categories: any[] = [];
  currentCategoryId: string | null = null;
  currentCategoryName: string | null = null;
  private routeSub: Subscription | undefined;
  private querySub: Subscription | undefined;
  searchTerm: string | null = null;

  // Filter properties
  selectedCategoryIds: string[] = [];
  priceRange = { min: null as number | null, max: null as number | null };
  selectedManufacturers: string[] = [];
  selectedAvailability: string[] = [];
  manufacturers: string[] = [];

  // Sorting
  currentSort = 'name-asc';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartState: CartStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const categoryId = params.get('id');
      this.currentCategoryId = categoryId;
      
      // Reset filters when navigating to different categories
      this.resetFilters();
      
      if (categoryId) {
        this.selectedCategoryIds = [categoryId];
        this.loadCategoryInfo(categoryId);
        this.loadProductsByCategory(categoryId);
      } else {
        this.currentCategoryName = null;
        this.loadAllProducts();
      }
    });

    this.querySub = this.route.queryParamMap.subscribe(qParams => {
      const term = qParams.get('search');
      this.searchTerm = term && term.trim().length > 0 ? term.trim() : null;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.querySub) {
      this.querySub.unsubscribe();
    }
  }

  private loadAllProducts(): void {
    this.productService
      .getList({ sorting: '', skipCount: 0, maxResultCount: 1000 })
      .subscribe((r: any) => {
        this.allProducts = Array.isArray(r) ? r : r.items ?? [];
        this.extractManufacturers();
        this.applyFilters();
      });
  }

  private loadProductsByCategory(categoryId: string): void {
    this.productService
      .getByCategory(categoryId)
      .subscribe((products: any[]) => {
        this.allProducts = products ?? [];
        this.extractManufacturers();
        this.applyFilters();
      });
  }

  private loadCategories(): void {
    this.categoryService.getLookup().subscribe({
      next: (categories: any[]) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private loadCategoryInfo(categoryId: string): void {
    this.categoryService.get(categoryId).subscribe({
      next: (category: any) => {
        this.currentCategoryName = category.name;
      },
      error: (error) => {
        console.error('Error loading category info:', error);
        this.currentCategoryName = 'Category';
      }
    });
  }

  private extractManufacturers(): void {
    const manufacturerSet = new Set<string>();
    this.allProducts.forEach(product => {
      if (product.manufacturer && product.manufacturer.trim()) {
        manufacturerSet.add(product.manufacturer.trim());
      }
    });
    this.manufacturers = Array.from(manufacturerSet).sort();
  }

  private resetFilters(): void {
    this.selectedCategoryIds = [];
    this.priceRange = { min: null, max: null };
    this.selectedManufacturers = [];
    this.selectedAvailability = [];
  }

  // Event handlers
  onCategoryChange(event: Event, categoryId: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.onCategoryFilterChange(categoryId, isChecked);
  }

  onManufacturerChange(event: Event, manufacturer: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.onManufacturerFilterChange(manufacturer, isChecked);
  }

  onAvailabilityChange(event: Event, availability: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.onAvailabilityFilterChange(availability, isChecked);
  }

  // Filter methods
  onCategoryFilterChange(categoryId: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedCategoryIds.includes(categoryId)) {
        this.selectedCategoryIds.push(categoryId);
      }
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }
    this.applyFilters();
  }

  onManufacturerFilterChange(manufacturer: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedManufacturers.includes(manufacturer)) {
        this.selectedManufacturers.push(manufacturer);
      }
    } else {
      this.selectedManufacturers = this.selectedManufacturers.filter(m => m !== manufacturer);
    }
    this.applyFilters();
  }

  onAvailabilityFilterChange(availability: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedAvailability.includes(availability)) {
        this.selectedAvailability.push(availability);
      }
    } else {
      this.selectedAvailability = this.selectedAvailability.filter(a => a !== availability);
    }
    this.applyFilters();
  }

  applyPriceFilter(): void {
    this.applyFilters();
  }

  onSortChange(sort: string): void {
    this.currentSort = sort;
    this.applyFilters();
  }

  clearFilters(): void {
    this.resetFilters();
    this.applyFilters();
  }

  private applyFilters(): void {
    let filteredProducts = [...this.allProducts];

    // Category filter
    if (this.selectedCategoryIds.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        this.selectedCategoryIds.includes(product.categoryId)
      );
    }

    // Price range filter
    if (this.priceRange.min !== null) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= this.priceRange.min!
      );
    }
    if (this.priceRange.max !== null) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= this.priceRange.max!
      );
    }

    // Manufacturer filter
    if (this.selectedManufacturers.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.manufacturer && this.selectedManufacturers.includes(product.manufacturer)
      );
    }

    // Availability filter
    if (this.selectedAvailability.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const inStock = product.stockQuantity > 0;
        if (this.selectedAvailability.includes('inStock') && inStock) return true;
        if (this.selectedAvailability.includes('outOfStock') && !inStock) return true;
        return false;
      });
    }

    // Search term filter
    if (this.searchTerm) {
      const lower = this.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        (product.name && product.name.toLowerCase().includes(lower)) ||
        (product.description && product.description.toLowerCase().includes(lower))
      );
    }

    // Apply sorting
    this.sortProducts(filteredProducts);
    
    this.products = filteredProducts;
  }

  private sortProducts(products: any[]): void {
    switch (this.currentSort) {
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'created-desc':
        products.sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime());
        break;
      default:
        // Default sorting by name
        products.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategoryIds.includes(categoryId);
  }

  isManufacturerSelected(manufacturer: string): boolean {
    return this.selectedManufacturers.includes(manufacturer);
  }

  isAvailabilitySelected(availability: string): boolean {
    return this.selectedAvailability.includes(availability);
  }

  hasActiveFilters(): boolean {
    return this.selectedCategoryIds.length > 0 ||
           this.priceRange.min !== null ||
           this.priceRange.max !== null ||
           this.selectedManufacturers.length > 0 ||
           this.selectedAvailability.length > 0 ||
           !!this.searchTerm;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  clearPriceFilter(): void {
    this.priceRange = { min: null, max: null };
    this.applyFilters();
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/store/product', productId]);
  }

  addToCart(product: any): void {
    this.cartState.addItem(product.id, 1);
  }
} 