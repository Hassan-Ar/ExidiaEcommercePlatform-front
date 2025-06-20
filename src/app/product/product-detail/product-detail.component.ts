import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductService } from '../../proxy/products/product.service';
import { ProductDto } from '../../proxy/products/dtos/models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: ProductDto | null = null;
  loading: boolean = true;
  error: string | null = null;
  defaultImage: string = 'https://via.placeholder.com/400x400/f8f9fa/6c757d?text=No+Image';
  showImageModal: boolean = false;
  selectedImage: string | null = null;
  canDelete: boolean = true; // Set based on user permissions
  canDuplicate: boolean = true; // Set based on user permissions

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.error = null;
      
      this.productService.get(id)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (data) => {
            this.product = data;
          },
          error: (error) => {
            console.error('Error loading product:', error);
            this.error = 'Failed to load product details. Please try again.';
          }
        });
    } else {
      this.error = 'Invalid product ID';
      this.loading = false;
    }
  }

  navigateToEdit(): void {
    if (this.product) {
      this.router.navigate(['/products', this.product.id, 'edit']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  retry(): void {
    this.loadProduct();
  }

  openImageModal(): void {
    if (this.product?.imageUrl) {
      this.showImageModal = true;
    }
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImage = null;
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  getStockStatusClass(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity === 0) {
      return 'out-of-stock';
    } else if (this.product.stockQuantity < 10) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }

  getStockStatusText(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity === 0) {
      return 'Out of Stock';
    } else if (this.product.stockQuantity < 10) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }

  getStockPercentage(): number {
    if (!this.product) return 0;
    
    // Calculate percentage based on a reasonable max stock (e.g., 100)
    const maxStock = Math.max(100, this.product.stockQuantity);
    return (this.product.stockQuantity / maxStock) * 100;
  }

  getStockProgressClass(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity === 0) {
      return 'bg-danger';
    } else if (this.product.stockQuantity < 10) {
      return 'bg-warning';
    } else {
      return 'bg-success';
    }
  }

  confirmDelete(): void {
    if (this.product && confirm(`Are you sure you want to delete "${this.product.name}"?`)) {
      this.deleteProduct();
    }
  }

  deleteProduct(): void {
    if (!this.product) return;
    
    this.productService.delete(this.product.id)
      .subscribe({
        next: () => {
          // Navigate back to products list after successful deletion
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
  }

  duplicateProduct(): void {
    if (this.product) {
      // Navigate to create new product with pre-filled data
      this.router.navigate(['/products/new'], { 
        queryParams: { duplicate: this.product.id } 
      });
    }
  }

  toggleProductStatus(): void {
    if (!this.product) return;
    
    const action = this.product.isActive ? 'deactivate' : 'activate';
    const confirmMessage = `Are you sure you want to ${action} "${this.product.name}"?`;
    
    if (confirm(confirmMessage)) {
      // TODO: Implement toggle status API call
      console.log(`Toggling product status: ${action}`);
      // For now, just update locally
      this.product.isActive = !this.product.isActive;
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
  }
} 