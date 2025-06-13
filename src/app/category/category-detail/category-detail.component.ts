import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../proxy/application/services/category.service';
import { CategoryDto } from '../../proxy/application/services/models';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  categoryId: string;
  category: CategoryDto | null = null;
  parentCategory: CategoryDto | null = null;
  subCategories: CategoryDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory(): void {
    this.categoryService.get(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        if (category.parentCategoryId) {
          this.loadParentCategory(category.parentCategoryId);
        }
        this.loadSubCategories();
      },
      error: () => {
        this.router.navigate(['/categories']);
      }
    });
  }

  loadParentCategory(parentId: string): void {
    this.categoryService.get(parentId).subscribe({
      next: (parent) => {
        this.parentCategory = parent;
      }
    });
  }

  loadSubCategories(): void {
    // Since getChildCategories endpoint doesn't exist, we'll get all categories and filter
    this.categoryService.getList().subscribe({
      next: (data: any) => {
        console.log('All categories for filtering:', data);
        
        let allCategories: CategoryDto[] = [];
        
        // Handle different response formats (same logic as category form)
        if (Array.isArray(data)) {
          allCategories = data;
        } else if (data && Array.isArray(data.items)) {
          allCategories = data.items;
        } else if (data && data.result) {
          if (Array.isArray(data.result)) {
            allCategories = data.result;
          } else if (data.result.items) {
            allCategories = data.result.items;
          }
        }
        
        // Filter categories that have this category as parent
        this.subCategories = allCategories.filter(cat => 
          cat.parentCategoryId === this.categoryId
        );
        
        console.log('Filtered subcategories:', this.subCategories);
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        this.subCategories = [];
      }
    });
  }

  toggleCategoryStatus(category: CategoryDto): void {
    this.categoryService.toggleActiveStatus(category.id).subscribe({
      next: () => {
        this.loadCategory();
      },
      error: (error) => {
        console.error('Error toggling category status:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }
} 