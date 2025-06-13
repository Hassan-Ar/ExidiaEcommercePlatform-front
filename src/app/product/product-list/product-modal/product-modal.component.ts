import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
        <div class="form-group">
          <label for="name">Product Name</label>
          <input type="text" id="name" formControlName="name" class="form-control" />
          <div *ngIf="productForm.controls['name'].invalid && productForm.controls['name'].touched" class="text-danger">
            Name is required.
          </div>
        </div>
        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" formControlName="price" class="form-control" />
          <div *ngIf="productForm.controls['price'].invalid && productForm.controls['price'].touched" class="text-danger">
            Price is required and must be positive.
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss('Cancel click')">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="saveProduct()" [disabled]="productForm.invalid">Save</button>
    </div>
  `,
})
export class ProductModalComponent implements OnInit {
  productForm: FormGroup;
  title: string = 'Create New Product';
  product: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    if (this.product) {
      this.title = 'Edit Product';
      this.productForm.patchValue(this.product);
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      this.activeModal.close(this.productForm.value);
    }
  }
} 