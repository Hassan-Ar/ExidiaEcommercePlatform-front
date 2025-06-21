import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../../proxy/categories/category.service';
import { CategoryDto } from '../../../proxy/categories/dtos/models';
import { ProductDto } from '../../../proxy/products/dtos/models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  productForm: FormGroup;
  title: string = 'Create New Product';
  product: ProductDto;
  categories: CategoryDto[] = [];
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPercent: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      isActive: [true],
      categoryId: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    if (this.product) {
      this.title = 'Edit Product';
      this.productForm.patchValue(this.product);
    }
  }

  loadCategories(): void {
    this.categoryService.getList({
      maxResultCount: 1000,
      skipCount: 0,
      sorting: 'name'
    }).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.categories = response;
        } else if (response && response.items) {
          this.categories = response.items;
        } else {
          this.categories = [];
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      
      const formData = { ...this.productForm.value };
      
      // Add the image file if selected
      if (this.selectedFile) {
        formData.image = this.selectedFile;
      }
      
      this.activeModal.close(formData);
    }
  }

  calculateOriginalPrice(): void {
    // This method is called when price or discount changes to trigger price calculation display
    // The actual calculation is done in the getter methods
  }

  showPriceCalculation(): boolean {
    const price = this.productForm.get('price')?.value;
    const discount = this.productForm.get('discountPercent')?.value;
    return price > 0 && discount > 0;
  }

  getOriginalPrice(): number {
    const finalPrice = this.productForm.get('price')?.value || 0;
    const discountPercent = this.productForm.get('discountPercent')?.value || 0;
    
    if (discountPercent === 0) {
      return finalPrice;
    }
    
    // Calculate original price: finalPrice = originalPrice * (1 - discount/100)
    // So: originalPrice = finalPrice / (1 - discount/100)
    return finalPrice / (1 - discountPercent / 100);
  }

  getDiscountAmount(): number {
    const originalPrice = this.getOriginalPrice();
    const finalPrice = this.productForm.get('price')?.value || 0;
    return originalPrice - finalPrice;
  }
} 