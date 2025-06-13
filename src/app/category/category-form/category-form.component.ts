import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../proxy/application/services/category.service';
import { CategoryDto } from '../../proxy/application/services/models';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;
  categories: CategoryDto[] = [];
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      parentCategoryId: [null],
      imageUrl: ['', Validators.pattern('https?://.*')],
      displayOrder: [0, [Validators.min(0)]]
    });
  }

  get f() {
    return this.categoryForm.controls;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.categoryId = this.route.snapshot.paramMap.get('id');
    
    // Check for parentId query parameter when creating a subcategory
    const parentId = this.route.snapshot.queryParamMap.get('parentId');
    if (parentId && !this.categoryId) {
      this.categoryForm.patchValue({ parentCategoryId: parentId });
    }
    
    if (this.categoryId) {
      this.isEditMode = true;
      this.loadCategory();
    }
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getList().subscribe({
      next: (data: any) => {
        console.log('Categories response:', data); // Debug log to see actual structure
        
        // ABP typically wraps responses in various ways, let's handle them all
        if (Array.isArray(data)) {
          // Direct array response
          this.categories = data;
        } else if (data && Array.isArray(data.items)) {
          // Paged result with items array
          this.categories = data.items;
        } else if (data && data.result) {
          // Wrapped in result property
          if (Array.isArray(data.result)) {
            this.categories = data.result;
          } else if (data.result.items) {
            this.categories = data.result.items;
          } else {
            this.categories = [];
          }
        } else {
          // Fallback: empty array
          this.categories = [];
        }
        
        // Filter out current category if in edit mode to prevent self-parent assignment
        if (this.isEditMode && this.categoryId) {
          this.categories = this.categories.filter(cat => cat.id !== this.categoryId);
        }
        
        this.loading = false;
        console.log('Processed categories:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
        this.categories = [];
      }
    });
  }

  loadCategory(): void {
    this.loading = true;
    this.categoryService.get(this.categoryId!).subscribe({
      next: (category) => {
        this.categoryForm.patchValue(category);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.categoryForm.valid) {
      this.loading = true;
      if (this.isEditMode) {
        this.categoryService.update(this.categoryId!, this.categoryForm.value).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/categories']);
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.categoryService.create(this.categoryForm.value).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/categories']);
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }
} 