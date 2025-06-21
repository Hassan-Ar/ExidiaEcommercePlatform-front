import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../proxy/products/product.service';
import { CategoryService } from '../../proxy/categories/category.service';
import { ProductDto, CreateUpdateProductDto } from '../../proxy/products/dtos/models';
import { CategoryDto } from '../../proxy/categories/dtos/models';

@Component({
  selector: 'app-product-form',
  template: `
    <div class="card">
      <div class="card-header">
        <h2>{{ isEditMode ? 'Edit Product' : 'Create Product' }}</h2>
      </div>
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" formControlName="name">
            <div class="invalid-feedback" *ngIf="form.get('name').invalid && form.get('name').touched">
              Name is required
            </div>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" formControlName="description" rows="3"></textarea>
          </div>

          <div class="mb-3">
            <label for="price" class="form-label">Final Price (After Discount)</label>
            <input type="number" class="form-control" id="price" formControlName="price" min="0" step="0.01" (input)="calculateOriginalPrice()">
            <div class="form-text">Enter the final selling price after applying any discount.</div>
            <div class="invalid-feedback" *ngIf="form.get('price').invalid && form.get('price').touched">
              Price must be greater than or equal to 0
            </div>
          </div>

          <div class="mb-3">
            <label for="discountPercent" class="form-label">Discount Percentage</label>
            <div class="input-group">
              <input type="number" class="form-control" id="discountPercent" formControlName="discountPercent" 
                     min="0" max="100" step="0.01" placeholder="0" (input)="calculateOriginalPrice()">
              <span class="input-group-text">%</span>
            </div>
            <div class="form-text">Enter discount percentage (0-100%). The price above is the final price after discount.</div>
            <div class="invalid-feedback" *ngIf="form.get('discountPercent').invalid && form.get('discountPercent').touched">
              Discount must be between 0 and 100
            </div>
          </div>

          <!-- Price Calculation Display -->
          <div class="mb-3" *ngIf="showPriceCalculation()">
            <div class="alert alert-info">
              <h6 class="mb-2"><i class="fas fa-calculator me-2"></i>Price Breakdown:</h6>
              <div class="d-flex justify-content-between">
                <span>Original Price (before discount):</span>
                <strong>{{ getOriginalPrice() | currency }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span>Discount ({{ form.get('discountPercent')?.value }}%):</span>
                <strong class="text-danger">-{{ getDiscountAmount() | currency }}</strong>
              </div>
              <hr class="my-2">
              <div class="d-flex justify-content-between">
                <span><strong>Final Price:</strong></span>
                <strong class="text-success">{{ form.get('price')?.value | currency }}</strong>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="stockQuantity" class="form-label">Stock Quantity</label>
            <input type="number" class="form-control" id="stockQuantity" formControlName="stockQuantity" min="0">
            <div class="invalid-feedback" *ngIf="form.get('stockQuantity').invalid && form.get('stockQuantity').touched">
              Stock quantity must be greater than or equal to 0
            </div>
          </div>

          <div class="mb-3">
            <label for="sku" class="form-label">SKU</label>
            <input type="text" class="form-control" id="sku" formControlName="sku">
            <div class="invalid-feedback" *ngIf="form.get('sku').invalid && form.get('sku').touched">
              SKU is required
            </div>
          </div>

          <div class="mb-3">
            <label for="categoryId" class="form-label">Category</label>
            <select class="form-select" id="categoryId" formControlName="categoryId">
              <option value="">Select a category</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
            <div class="invalid-feedback" *ngIf="form.get('categoryId').invalid && form.get('categoryId').touched">
              Category is required
            </div>
          </div>

          <div class="mb-3">
            <label for="image" class="form-label">Product Image</label>
            <input type="file" class="form-control" id="image" (change)="onFileSelected($event)" accept="image/*">
            <div *ngIf="selectedFile || currentImageUrl" class="mt-2">
              <img [src]="previewUrl || currentImageUrl" class="img-thumbnail" style="max-height: 200px;">
            </div>
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="isActive" formControlName="isActive">
              <label class="form-check-label" for="isActive">Active</label>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .card {
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  loading = false;
  categories: CategoryDto[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPercent: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      categoryId: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadProduct(id);
    }
  }

  loadCategories(): void {
    this.categoryService.getList({ maxResultCount: 1000 }).subscribe({
      next: (response) => {
        this.categories = response.items;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.get(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          discountPercent: product.discountPercent || 0,
          stockQuantity: product.stockQuantity,
          sku: product.sku,
          categoryId: product.categoryId,
          isActive: product.isActive
        });
        this.currentImageUrl = product.imageUrl;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    if (!this.selectedFile && !this.isEditMode) {
      alert('Please select an image for the product');
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    const dto: CreateUpdateProductDto = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      discountPercent: formValue.discountPercent || 0,
      stockQuantity: formValue.stockQuantity,
      sku: formValue.sku,
      categoryId: formValue.categoryId,
      isActive: formValue.isActive,
      image: this.selectedFile || undefined
    };

    if (this.isEditMode) {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        console.error('No product ID found for update');
        this.loading = false;
        return;
      }
      this.productService.update(id, dto).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.loading = false;
        }
      });
    } else {
      this.productService.create(dto).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  calculateOriginalPrice(): void {
    // This method is called when price or discount changes to trigger price calculation display
    // The actual calculation is done in the getter methods
  }

  showPriceCalculation(): boolean {
    const price = this.form.get('price')?.value;
    const discount = this.form.get('discountPercent')?.value;
    return price > 0 && discount > 0;
  }

  getOriginalPrice(): number {
    const finalPrice = this.form.get('price')?.value || 0;
    const discountPercent = this.form.get('discountPercent')?.value || 0;
    
    if (discountPercent === 0) {
      return finalPrice;
    }
    
    // Calculate original price: finalPrice = originalPrice * (1 - discount/100)
    // So: originalPrice = finalPrice / (1 - discount/100)
    return finalPrice / (1 - discountPercent / 100);
  }

  getDiscountAmount(): number {
    const originalPrice = this.getOriginalPrice();
    const finalPrice = this.form.get('price')?.value || 0;
    return originalPrice - finalPrice;
  }
} 