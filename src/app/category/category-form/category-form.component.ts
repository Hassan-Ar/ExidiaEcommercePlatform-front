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
            <label for="parentId" class="form-label">Parent Category</label>
            <select class="form-select" id="parentId" formControlName="parentId">
              <option value="">None</option>
              <option *ngFor="let category of categories" [value]="category.id" [disabled]="isEditMode && category.id === currentId">
                {{ category.name }}
              </option>
            </select>
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
            <label for="displayOrder" class="form-label">Display Order</label>
            <input type="number" class="form-control" id="displayOrder" formControlName="displayOrder" min="0">
            <div class="invalid-feedback" *ngIf="form.get('displayOrder').invalid && form.get('displayOrder').touched">
              Display order must be greater than or equal to 0
            </div>
          </div>

          <div class="mb-3">
            <label for="image" class="form-label">Category Image</label>
            <input type="file" class="form-control" id="image" (change)="onFileSelected($event)" accept="image/*">
            <div *ngIf="selectedFile || currentImageUrl" class="mt-2">
              <img [src]="previewUrl || currentImageUrl" class="img-thumbnail" style="max-height: 200px;">
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
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  loading = false;
  categories: CategoryDto[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentImageUrl: string | null = null;
  currentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      parentId: [''],
      isActive: [true],
      displayOrder: [0, [Validators.required, Validators.min(0)]]
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
    this.categoryService.getList({ 
      sorting: 'name',
      maxResultCount: 1000,
      skipCount: 0
    }).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.categories = response;
        } else if (response && response.items) {
          this.categories = response.items;
        } else if (response && response.result) {
          this.categories = Array.isArray(response.result) ? response.result : response.result.items || [];
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
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

    this.loading = true;
    const formValue = this.form.value;

    const dto: CreateUpdateCategoryDto = {
      name: formValue.name,
      description: formValue.description,
      parentId: formValue.parentId,
      displayOrder: formValue.displayOrder,
      isActive: formValue.isActive,
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
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }
} 