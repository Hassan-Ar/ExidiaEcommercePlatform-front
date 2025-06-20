import type { CreateUpdateProductDto, ProductDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiName = 'Default';
  

  create = (input: CreateUpdateProductDto, config?: Partial<Rest.Config>) => {
    const formData = this.createFormData(input);
    return this.restService.request<any, ProductDto>({
      method: 'POST',
      url: '/api/app/product',
      body: formData,
    },
    { apiName: this.apiName,...config });
  }
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/product/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto>({
      method: 'GET',
      url: `/api/app/product/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByCategory = (categoryId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto[]>({
      method: 'GET',
      url: `/api/app/product/by-category/${categoryId}`,
    },
    { apiName: this.apiName,...config });
  

  getByShop = (shopId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto[]>({
      method: 'GET',
      url: `/api/app/product/by-shop/${shopId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto & { filter?: string; categoryId?: string; isActive?: boolean }, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductDto>>({
      method: 'GET',
      url: '/api/app/product',
      params: { 
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        filter: input.filter,
        categoryId: input.categoryId,
        isActive: input.isActive
      },
    },
    { apiName: this.apiName,...config });
  

  toggleActiveStatus = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto>({
      method: 'POST',
      url: `/api/app/product/${id}/toggle-active-status`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateProductDto, config?: Partial<Rest.Config>) => {
    const formData = this.createFormData(input);
    return this.restService.request<any, ProductDto>({
      method: 'PUT',
      url: `/api/app/product/${id}`,
      body: formData,
    },
    { apiName: this.apiName,...config });
  }
  

  updatePrice = (id: string, newPrice: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto>({
      method: 'PUT',
      url: `/api/app/product/${id}/price`,
      params: { newPrice },
    },
    { apiName: this.apiName,...config });
  

  updateStock = (id: string, quantity: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto>({
      method: 'PUT',
      url: `/api/app/product/${id}/stock`,
      params: { quantity },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}

  private createFormData(input: CreateUpdateProductDto): FormData {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', input.name || '');
    formData.append('description', input.description || '');
    formData.append('price', input.price?.toString() || '0');
    formData.append('stockQuantity', input.stockQuantity?.toString() || '0');
    formData.append('sku', input.sku || '');
    formData.append('isActive', input.isActive?.toString() || 'false');
    formData.append('categoryId', input.categoryId || '');
    
    // Add image file if exists
    if (input.image) {
      formData.append('image', input.image);
    }
    
    return formData;
  }
}
