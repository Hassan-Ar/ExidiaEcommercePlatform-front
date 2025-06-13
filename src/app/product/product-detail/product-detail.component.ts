import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../proxy/application/services/product.service';

@Component({
  selector: 'app-product-detail',
  template: `
    <h2>Product Detail</h2>
    <div *ngIf="product">
      <h3>{{ product.name }}</h3>
      <p>Price: {{ product.price }}</p>
      <p>Description: {{ product.description }}</p>
      <button (click)="navigateToEdit()">Edit</button>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.get(id).subscribe((data) => {
        this.product = data;
      });
    }
  }

  navigateToEdit(): void {
    this.router.navigate(['/products', this.product.id, 'edit']);
  }
} 