import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../proxy/categories/category.service';
import { CategoryDto, CreateUpdateCategoryDto } from '../../proxy/categories/dtos/models';

@Component({
  selector: 'app-category-form',
  template: `
    <div class="card">
      <div class="card-header">
        <h2>{{ isEditMode ? 'Edit Category' : 'Create Category' }}</h2>
      </div>
      <div class="card-body">
        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="name" class="form-label">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="name" formControlName="name"
                   [ngClass]="{'is-invalid': form.get('name')?.invalid && form.get('name')?.touched}">
            <div class="invalid-feedback" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
              <span *ngIf="form.get('name')?.errors?.['required']">Name is required</span>
              <span *ngIf="form.get('name')?.errors?.['minlength']">Name must be at least 2 characters</span>
              <span *ngIf="form.get('name')?.errors?.['maxlength']">Name cannot exceed 100 characters</span>
            </div>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" formControlName="description" rows="3"
                      [ngClass]="{'is-invalid': form.get('description')?.invalid && form.get('description')?.touched}"></textarea>
            <div class="invalid-feedback" *ngIf="form.get('description')?.invalid && form.get('description')?.touched">
              <span *ngIf="form.get('description')?.errors?.['maxlength']">Description cannot exceed 500 characters</span>
            </div>
          </div>

          <div class="mb-3">
            <label for="parentId" class="form-label">Parent Category</label>
            <select class="form-select" id="parentId" formControlName="parentId"
                    [ngClass]="{'is-invalid': form.get('parentId')?.invalid && form.get('parentId')?.touched}">
              <option value="">None</option>
              <option *ngFor="let category of categories" [value]="category.id" [disabled]="isEditMode && category.id === currentId">
                {{ category.name }}
              </option>
            </select>
            <div class="invalid-feedback" *ngIf="form.get('parentId')?.invalid && form.get('parentId')?.touched">
              <span *ngIf="form.get('parentId')?.errors?.['invalidParent']">Cannot select this category as parent</span>
            </div>
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="isActive" formControlName="isActive">
              <label class="form-check-label" for="isActive">
                Active
              </label>
            </div>
          </div>

          <div class="mb-3">
            <label for="displayOrder" class="form-label">Display Order <span class="text-danger">*</span></label>
            <input type="number" class="form-control" id="displayOrder" formControlName="displayOrder" 
                   min="0" step="1"
                   [ngClass]="{'is-invalid': form.get('displayOrder')?.invalid && form.get('displayOrder')?.touched}">
            <div class="invalid-feedback" *ngIf="form.get('displayOrder')?.invalid && form.get('displayOrder')?.touched">
              <span *ngIf="form.get('displayOrder')?.errors?.['required']">Display order is required</span>
              <span *ngIf="form.get('displayOrder')?.errors?.['min']">Display order must be greater than or equal to 0</span>
              <span *ngIf="form.get('displayOrder')?.errors?.['pattern']">Please enter a valid number</span>
            </div>
          </div>

          <div class="mb-3">
            <label for="image" class="form-label">Category Image</label>
            <input type="file" class="form-control" id="image" (change)="onFileSelected($event)" accept="image/*">
            <div *ngIf="selectedFile || currentImageUrl" class="mt-2">
              <img [src]="previewUrl || currentImageUrl" class="img-thumbnail" style="max-height: 200px;">
            </div>
            <div *ngIf="fileError" class="text-danger mt-1 small">{{ fileError }}</div>
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
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  loading = false;
  categories: CategoryDto[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentImageUrl: string | null = null;
  currentId: string | null = null;
  errorMessage: string = '';
  fileError: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      parentId: [''],
      isActive: [true],
      displayOrder: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentId = id;
      this.loadCategory(id);
    }
  }

  loadCategories(): void {
    this.categoryService.getList({ maxResultCount: 1000 }).subscribe({
      next: (response) => {
        this.categories = response.items;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
      }
    });
  }

  loadCategory(id: string): void {
    this.loading = true;
    this.categoryService.get(id).subscribe({
      next: (category) => {
        this.form.patchValue({
          name: category.name,
          description: category.description,
          parentId: category.parentCategoryId,
          isActive: category.isActive,
          displayOrder: category.displayOrder
        });
        // @ts-ignore - imageUrl exists in backend but not in proxy
        this.currentImageUrl = category.imageUrl;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.errorMessage = 'Failed to load category details. Please try again.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.fileError = '';
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.fileError = 'Please select a valid image file.';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'Image file size must be less than 5MB.';
        return;
      }
      
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    // Clear previous errors
    this.errorMessage = '';
    
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    // Validate and clean data before sending
    const dto: CreateUpdateCategoryDto = {
      name: formValue.name?.trim(),
      description: formValue.description?.trim() || '',
      parentId: formValue.parentId || undefined,
      displayOrder: Number(formValue.displayOrder) || 0,
      isActive: Boolean(formValue.isActive),
      image: this.selectedFile || undefined
    };

    if (this.isEditMode) {
      const id = this.route.snapshot.paramMap.get('id');
      this.categoryService.update(id!, dto).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.handleError(error);
          this.loading = false;
        }
      });
    } else {
      this.categoryService.create(dto).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.handleError(error);
          this.loading = false;
        }
      });
    }
  }

  private handleError(error: any): void {
    if (error.error?.error?.message) {
      this.errorMessage = error.error.error.message;
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else if (error.message) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }
} 