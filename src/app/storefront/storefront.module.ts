import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StorefrontRoutingModule } from './storefront-routing.module';
import { StorefrontLayoutComponent } from './store-layout/storefront-layout.component';
import { ProductCatalogComponent } from './product-catalog/product-catalog.component';
import { StoreHeaderComponent } from './shared/store-header.component';
import { StoreFooterComponent } from './shared/store-footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProductDetailModalComponent } from './product-detail-modal/product-detail-modal.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { ChatAssistantComponent } from './chat-assistant/chat-assistant.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [StorefrontLayoutComponent, StoreHeaderComponent, StoreFooterComponent, ProductCatalogComponent, HomePageComponent, ProductDetailModalComponent, ProductDetailPageComponent, CartPageComponent, ChatAssistantComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, StorefrontRoutingModule, HttpClientModule],
  exports: [ProductDetailModalComponent],
})
export class StorefrontModule {} 