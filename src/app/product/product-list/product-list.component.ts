import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../proxy/application/services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductDto } from '../../proxy/application/services/models';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="card">
      <div class="card-header">
        <h2>Products</h2>
        <button class="btn btn-primary" (click)="openCreateProductModal()">Create New Product</button>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>{{ product.name }}</td>
              <td>{{ product.basePrice }}</td>
              <td>
                <a [routerLink]="['/products', product.id]" class="btn btn-info">View</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getList().subscribe({
      next: (response) => {
        // Ensure we're working with an array
        this.products = Array.isArray(response) ? response : [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.loading = false;
      }
    });
  }

  openCreateProductModal(): void {
    const modalRef = this.modalService.open(ProductModalComponent);
    modalRef.componentInstance.title = 'Create New Product';

    modalRef.result.then(
      (result) => {
        if (result) {
          this.productService.create(result).subscribe({
            next: (newProduct) => {
              this.products.push(newProduct);
            },
            error: (error) => {
              console.error('Error creating product:', error);
            }
          });
        }
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason);
      }
    );
  }

  // You can add an edit modal function similar to this
  // openEditProductModal(product: any): void {
  //   const modalRef = this.modalService.open(ProductModalComponent);
  //   modalRef.componentInstance.title = 'Edit Product';
  //   modalRef.componentInstance.product = product;

  //   modalRef.result.then(
  //     (result) => {
  //       if (result) {
  //         // Handle update logic here
  //       }
  //     },
  //     (reason) => {
  //       console.log('Modal dismissed with reason:', reason);
  //     }
  //   );
  // }
} 