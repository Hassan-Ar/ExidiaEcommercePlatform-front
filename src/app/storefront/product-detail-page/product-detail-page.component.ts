import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../proxy/products/product.service';
import { ProductDto } from '../../proxy/products/dtos/models';
import { CartStateService } from '../shared/cart-state.service';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css'],
})
export class ProductDetailPageComponent implements OnInit {
  product: ProductDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartState: CartStateService
  ) {}

  ngOnInit(): void {
    // Ensure viewport starts at top on navigation
    window.scrollTo({ top: 0 });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.get(id).subscribe((p) => {
        this.product = p;
        // Ensure after content load we are at top
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      });
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartState.addItem(this.product.id, 1);
    }
  }
} 