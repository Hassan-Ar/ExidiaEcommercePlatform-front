import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../proxy/products/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductDto } from '../../proxy/products/dtos/models';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2>Products</h2>
        <div>
          <span class="badge bg-success me-2">Active: {{ getActiveCount() }}</span>
          <span class="badge bg-warning">Inactive: {{ getInactiveCount() }}</span>
          <button class="btn btn-primary ms-3" (click)="openCreateProductModal()">Create New Product</button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of products">
                <td>
                  <img *ngIf="product.imageUrl" 
                       [src]="product.imageUrl" 
                       [alt]="product.name"
                       class="product-image"
                       (error)="onImageError($event)">
                </td>
                <td>{{ product.name }}</td>
                <td>{{ product.sku }}</td>
                <td>{{ product.price | currency }}</td>
                <td>
                  <span [class]="getStockClass(product.stockQuantity)">
                    {{ product.stockQuantity }}
                  </span>
                </td>
                <td>
                  <span [class]="product.isActive ? 'badge bg-success' : 'badge bg-warning'">
                    {{ product.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <a [routerLink]="['/products', product.id]" class="btn btn-info btn-sm">View</a>
                    <button class="btn btn-primary btn-sm" (click)="openEditProductModal(product)">Edit</button>
                    <button class="btn btn-sm" 
                            [class]="product.isActive ? 'btn-warning' : 'btn-success'"
                            (click)="toggleProductStatus(product)">
                      {{ product.isActive ? 'Deactivate' : 'Activate' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    .btn-group .btn {
      padding: 0.25rem 0.5rem;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getList({ 
      sorting: 'name',
      maxResultCount: 1000,
      skipCount: 0
    }).subscribe({
      next: (response: any) => {
        console.log('Product list response:', response); // Debug log
        // Handle both array and paginated response formats
        if (Array.isArray(response)) {
          this.products = response;
        } else if (response && response.items) {
          this.products = response.items;
        } else if (response && response.result) {
          this.products = Array.isArray(response.result) ? response.result : response.result.items || [];
        } else {
          this.products = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.loading = false;
      }
    });
  }

  openCreateProductModal(): void {
    const modalRef = this.modalService.open(ProductModalComponent);
    modalRef.componentInstance.title = 'Create New Product';

    modalRef.result.then(
      (result) => {
        if (result) {
          this.productService.create(result).subscribe({
            next: (newProduct) => {
              this.products.push(newProduct);
            },
            error: (error) => {
              console.error('Error creating product:', error);
            }
          });
        }
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason);
      }
    );
  }

  openEditProductModal(product: ProductDto): void {
    const modalRef = this.modalService.open(ProductModalComponent);
    modalRef.componentInstance.title = 'Edit Product';
    modalRef.componentInstance.product = product;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.productService.update(product.id, result).subscribe({
            next: (updatedProduct) => {
              const index = this.products.findIndex(p => p.id === updatedProduct.id);
              if (index !== -1) {
                this.products[index] = updatedProduct;
              }
            },
            error: (error) => {
              console.error('Error updating product:', error);
            }
          });
        }
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason);
      }
    );
  }

  toggleProductStatus(product: ProductDto): void {
    this.productService.toggleActiveStatus(product.id).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
      },
      error: (error) => {
        console.error('Error toggling product status:', error);
      }
    });
  }

  getActiveCount(): number {
    return this.products.filter(product => product.isActive).length;
  }

  getInactiveCount(): number {
    return this.products.filter(product => !product.isActive).length;
  }

  getStockClass(quantity: number): string {
    if (quantity <= 0) return 'text-danger';
    if (quantity < 10) return 'text-warning';
    return 'text-success';
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }
} 