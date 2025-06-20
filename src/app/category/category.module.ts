import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryRoutingModule } from './category-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent,
    CategoryDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CategoryRoutingModule,
    SharedModule
  ],
  exports: [
    CategoryListComponent,
    CategoryFormComponent,
    CategoryDetailComponent
  ]
})
export class CategoryModule { } 