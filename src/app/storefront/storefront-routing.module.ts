import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorefrontLayoutComponent } from './store-layout/storefront-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProductCatalogComponent } from './product-catalog/product-catalog.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: StorefrontLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'products', component: ProductCatalogComponent },
      { path: 'product/:id', component: ProductDetailPageComponent },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class StorefrontRoutingModule {} 