import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../proxy/categories/category.service';
import { CategoryDto } from '../../proxy/categories/dtos/models';
import { PagedResultDto } from '@abp/ng.core';

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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/categories']);
      return;
    }
    this.categoryId = id;
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
    // Use the proper getSubCategories method that exists in the service
    this.categoryService.getSubCategories(this.categoryId).subscribe({
      next: (subCategories: CategoryDto[]) => {
        this.subCategories = subCategories;
        console.log('Loaded subcategories:', this.subCategories);
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        this.subCategories = [];
        
        // Fallback: get all categories and filter if getSubCategories fails
        this.categoryService.getList({ 
          sorting: 'name',
          maxResultCount: 1000,
          skipCount: 0
        }).subscribe({
          next: (data: PagedResultDto<CategoryDto>) => {
            console.log('All categories for filtering:', data);
            
            // Filter categories that have this category as parent
            this.subCategories = data.items.filter(cat => 
              cat.parentCategoryId === this.categoryId
            );
            
            console.log('Filtered subcategories:', this.subCategories);
          },
          error: (fallbackError) => {
            console.error('Error loading subcategories (fallback):', fallbackError);
            this.subCategories = [];
          }
        });
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