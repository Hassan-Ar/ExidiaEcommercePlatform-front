import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../proxy/categories/category.service';
import { CategoryDto } from '../../proxy/categories/dtos/models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: CategoryDto[] = [];
  loading = false;
  filter = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  private searchChanged: Subject<string> = new Subject<string>();

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.searchChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.filter = term;
      this.loadCategories();
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getList({ 
      sorting: 'name',
      maxResultCount: 1000,
      skipCount: 0,
      filter: this.filter,
      isActive: this.statusFilter === 'all' ? undefined : this.statusFilter === 'active'
    }).subscribe({
      next: (response: any) => {
        console.log('Category list response:', response); // Debug log
        // Handle both array and paginated response formats
        if (Array.isArray(response)) {
          this.categories = response;
        } else if (response && response.items) {
          this.categories = response.items;
        } else if (response && response.result) {
          this.categories = Array.isArray(response.result) ? response.result : response.result.items || [];
        } else {
          this.categories = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
        this.loading = false;
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/categories/create']);
  }

  toggleCategoryStatus(category: CategoryDto): void {
    this.categoryService.toggleActiveStatus(category.id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error toggling category status:', error);
      }
    });
  }

  getActiveCount(): number {
    return this.categories.filter(category => category.isActive).length;
  }

  getInactiveCount(): number {
    return this.categories.filter(category => !category.isActive).length;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  applyStatusFilter(): void {
    this.loadCategories();
  }

  onSearchTextChange(val: string): void {
    this.searchChanged.next(val);
  }
} 