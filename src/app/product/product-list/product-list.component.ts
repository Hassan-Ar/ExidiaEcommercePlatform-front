import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../proxy/products/product.service';
import { CategoryService } from '../../proxy/categories/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductDto } from '../../proxy/products/dtos/models';
import { CategoryDto } from '../../proxy/categories/dtos/models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  loading = false;
  // Filtering state
  filter = '';
  selectedCategoryId: string = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  categories: CategoryDto[] = [];

  private searchChanged: Subject<string> = new Subject<string>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    // set up debounced search
    this.searchChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.filter = term;
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.categoryService.getList({ maxResultCount: 1000 }).subscribe({
      next: (response: any) => {
        this.categories = Array.isArray(response) ? response : (response?.items || []);
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getList({ 
      sorting: 'name',
      maxResultCount: 1000,
      skipCount: 0,
      filter: this.filter,
      categoryId: this.selectedCategoryId || undefined,
      isActive: this.statusFilter === 'all' ? undefined : this.statusFilter === 'active'
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

  getTotalStock(): number {
    return this.products.reduce((total, product) => total + product.stockQuantity, 0);
  }

  // Called when filter inputs change
  applyFilters(): void {
    this.loadProducts();
  }

  onFilterTextChange(value: string): void {
    this.searchChanged.next(value);
  }

  getOriginalPrice(product: ProductDto): number {
    if (product.discountPercent && product.discountPercent > 0) {
      // Calculate original price: finalPrice = originalPrice * (1 - discount/100)
      // So: originalPrice = finalPrice / (1 - discount/100)
      return product.price / (1 - product.discountPercent / 100);
    }
    return product.price;
  }
} 