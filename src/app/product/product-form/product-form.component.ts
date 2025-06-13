import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../proxy/application/services/product.service';

@Component({
  selector: 'app-product-form',
  template: `
    <h2>{{ isEditMode ? 'Edit Product' : 'Create Product' }}</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Name:</label>
        <input id="name" formControlName="name" />
      </div>
      <div>
        <label for="price">Price:</label>
        <input id="price" formControlName="price" type="number" />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" formControlName="description"></textarea>
      </div>
      <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button>
    </form>
  `,
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.productService.get(this.productId).subscribe((product) => {
        this.productForm.patchValue(product);
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.isEditMode) {
        this.productService.update(this.productId!, this.productForm.value).subscribe(() => {
          this.router.navigate(['/products']);
        });
      } else {
        this.productService.create(this.productForm.value).subscribe(() => {
          this.router.navigate(['/products']);
        });
      }
    }
  }
} 