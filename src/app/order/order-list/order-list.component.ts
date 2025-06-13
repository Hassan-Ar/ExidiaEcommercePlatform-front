import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../proxy/orders/order.service';

@Component({
  selector: 'app-order-list',
  template: `
    <div class="card">
      <div class="card-header">
        <h2>Orders</h2>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td>{{ order.id }}</td>
              <td>{{ order.customerName }}</td>
              <td>
                <a [routerLink]="['/orders', order.id]" class="btn btn-info">View</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getList({ 
      sorting: 'creationTime desc',
      maxResultCount: 1000,
      skipCount: 0
    }).subscribe((data) => {
      this.orders = data.items || [];
    });
  }
} 