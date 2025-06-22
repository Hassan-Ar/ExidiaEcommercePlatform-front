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
  

  getFeatured = (maxCount: number = 8, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto[]>({
      method: 'GET',
      url: '/api/app/product/featured',
      params: { maxCount },
    },
    { apiName: this.apiName, ...config });
  

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
  

  rate = (id: string, stars: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto>({
      method: 'POST',
      url: `/api/app/product/${id}/rate`,
      params: { stars },
    },
    { apiName: this.apiName, ...config });
  

  getLatestDiscounted = (maxCount: number = 10, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductDto[]>({
      method: 'GET',
      url: '/api/app/product/latest-discounted',
      params: { maxCount },
    },
    { apiName: this.apiName, ...config });
  

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
    
    // 🔥 الحل العملي: تنظيف وتحويل البيانات بشكل صحيح
    formData.append('name', String(input.name || '').trim());
    formData.append('description', String(input.description || '').trim());
    formData.append('price', String(parseFloat(input.price?.toString() || '0') || 0));
    formData.append('stockQuantity', String(parseInt(input.stockQuantity?.toString() || '0') || 0));
    formData.append('sku', String(input.sku || '').trim());
    formData.append('isActive', String(Boolean(input.isActive)));
    formData.append('categoryId', String(input.categoryId || ''));
    
    // 🔥 معالجة خاصة للخصم
    if (input.discountPercent !== undefined && input.discountPercent !== null) {
      const discount = parseFloat(input.discountPercent.toString()) || 0;
      formData.append('discountPercent', String(Math.max(0, Math.min(100, discount))));
    } else {
      formData.append('discountPercent', '0');
    }
    
    // 🔥 معالجة الصورة
    if (input.image && input.image instanceof File) {
      formData.append('image', input.image);
    }
    
    // 🔥 للتشخيص - طباعة البيانات المرسلة
    console.log('📤 Input object being sent:', input);
    console.log('📤 FormData created successfully');
    
    return formData;
  }
}
