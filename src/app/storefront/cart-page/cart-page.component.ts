import { Component, OnInit } from '@angular/core';
import { CartStateService } from '../shared/cart-state.service';
import { CartItemDto } from '../../proxy/carts/dtos/models';

@Component({
  selector: 'app-cart-page',
  template: `
    <div class="container py-4" *ngIf="cartService.cart$ | async as cart">
      <h1 class="mb-4">Shopping Cart</h1>

      <div *ngIf="cart.items?.length; else emptyTpl">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of cart.items">
                <td>{{ item.productName }}</td>
                <td>{{ item.unitPrice | currency }}</td>
                <td>
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    style="width: 80px;"
                    [value]="item.quantity"
                    (change)="updateQuantity(item, $any($event.target).value)"
                  />
                </td>
                <td>{{ item.totalPrice | currency }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-danger" (click)="removeItem(item)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end mt-4">
          <h4>Total: <span class="text-success">{{ cart.totalPrice | currency }}</span></h4>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-outline-secondary" (click)="cartService.clearCart()">
            Clear Cart
          </button>
          <button class="btn btn-primary" [disabled]="!cart.items.length">
            Checkout
          </button>
        </div>
      </div>

      <ng-template #emptyTpl>
        <div class="alert alert-info">Your cart is empty.</div>
      </ng-template>
    </div>
  `,
})
export class CartPageComponent implements OnInit {
  constructor(public cartService: CartStateService) {}

  ngOnInit(): void {}

  updateQuantity(item: CartItemDto, value: number): void {
    const qty = Number(value);
    if (qty > 0) {
      this.cartService.updateItemQuantity(item.id, qty);
    }
  }

  removeItem(item: CartItemDto): void {
    this.cartService.removeItem(item.id);
  }
} 