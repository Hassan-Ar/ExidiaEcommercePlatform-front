import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../proxy/products/product.service';
import { CategoryService } from '../../proxy/categories/category.service';
import { CartStateService } from '../shared/cart-state.service';

@Component({
  selector: 'app-store-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  featuredProducts: any[] = [];
  discountedProducts: any[] = [];
  topCategories: any[] = [];
  news = [
    { title: 'New online store is open!', date: new Date('2025-02-01'), excerpt: 'We are excited to announce the launch of our new online store. Shop the latest items now!' },
    { title: 'AppCommerce v2 released', date: new Date('2025-02-15'), excerpt: 'The second major release brings performance improvements and new features.' },
    { title: 'About AppCommerce', date: new Date('2025-02-20'), excerpt: 'Learn more about our journey and mission to deliver great ecommerce solutions.' },
  ];
  pollAnswers = ['Excellent', 'Good', 'Poor', 'Very bad'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartState: CartStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService
      .getFeatured(8)
      .subscribe((r: any) => (this.featuredProducts = r ?? []));

    this.productService
      .getLatestDiscounted(9)
      .subscribe((r: any) => (this.discountedProducts = r ?? []));

    this.categoryService
      .getTop(6)
      .subscribe((r: any) => (this.topCategories = r ?? []));
  }

  addToCart(product: any) {
    this.cartState.addItem(product.id, 1);
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/store/category', categoryId]);
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/store/product', productId]);
  }

  getDiscountedProducts(start: number, end: number): any[] {
    return this.discountedProducts.slice(start, end);
  }

  getDiscountPercentage(product: any): number {
    return product.discountPercent ?? 0;
  }

  getOriginalPrice(product: any): number | null {
    const discount = this.getDiscountPercentage(product);
    if (discount && discount > 0) {
      return product.price / (1 - discount / 100);
    }
    return null;
  }

  getStarIcon(rating: number, star: number): string {
    if (rating >= star) {
      return 'fas fa-star';
    }
    if (rating >= star - 0.5) {
      return 'fas fa-star-half-alt';
    }
    return 'far fa-star';
  }
}