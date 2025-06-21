import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-products',
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-box me-2"></i>
          Product Management
        </h1>
        <p class="page-description">
          Manage your product catalog, inventory, and product details
        </p>
      </div>

      <div class="page-content">
        <!-- Use existing product list component -->
        <app-product-list></app-product-list>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 0;
    }

    .page-header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .page-description {
      color: #6b7280;
      font-size: 16px;
      margin: 0;
    }

    .page-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    /* Override styles for better admin layout integration */
    :host ::ng-deep .card {
      border: none;
      box-shadow: none;
      border-radius: 0;
    }

    :host ::ng-deep .card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      padding: 20px 24px;
    }

    :host ::ng-deep .card-body {
      padding: 24px;
    }

    :host ::ng-deep .btn-primary {
      background: #3b82f6;
      border-color: #3b82f6;
      font-weight: 500;
    }

    :host ::ng-deep .btn-primary:hover {
      background: #2563eb;
      border-color: #2563eb;
    }

    :host ::ng-deep .table {
      font-size: 14px;
    }

    :host ::ng-deep .table th {
      font-weight: 600;
      color: #374151;
    }

    :host ::ng-deep .badge {
      font-size: 12px;
      padding: 4px 8px;
    }
  `]
})
export class AdminProductsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}