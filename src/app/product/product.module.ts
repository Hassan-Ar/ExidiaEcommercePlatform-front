import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductModalComponent } from './product-list/product-modal/product-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent, ProductFormComponent, ProductModalComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, NgbModule, ProductRoutingModule],
  exports: [ProductListComponent, ProductDetailComponent, ProductFormComponent], // Export components for reuse
  providers: [NgbActiveModal],
})
export class ProductModule {} 