import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';

// Import existing modules that contain the components we want to reuse
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminCategoriesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    AdminRoutingModule,
    ProductModule,
    CategoryModule
  ]
})
export class AdminModule { }