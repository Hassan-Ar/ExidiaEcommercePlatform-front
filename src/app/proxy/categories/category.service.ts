import type { CategoryDto, CreateUpdateCategoryDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiName = 'Default';
  

  addSubCategory = (parentId: string, input: CreateUpdateCategoryDto, config?: Partial<Rest.Config>) => {
    const formData = this.createFormData(input);
    return this.restService.request<any, CategoryDto>({
      method: 'POST',
      url: `/api/app/category/${parentId}/subcategories`,
      body: formData,
    },
    { apiName: this.apiName,...config });
  }
  

  create = (input: CreateUpdateCategoryDto, config?: Partial<Rest.Config>) => {
    const formData = this.createFormData(input);
    return this.restService.request<any, CategoryDto>({
      method: 'POST',
      url: '/api/app/category',
      body: formData,
    },
    { apiName: this.apiName,...config });
  }
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto>({
      method: 'GET',
      url: `/api/app/category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CategoryDto>>({
      method: 'GET',
      url: '/api/app/category',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getSubCategories = (parentId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto[]>({
      method: 'GET',
      url: `/api/app/category/${parentId}/subcategories`,
    },
    { apiName: this.apiName,...config });
  

  removeSubCategory = (parentId: string, subCategoryId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto>({
      method: 'DELETE',
      url: `/api/app/category/${parentId}/subcategories/${subCategoryId}`,
    },
    { apiName: this.apiName,...config });
  

  toggleActiveStatus = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CategoryDto>({
      method: 'POST',
      url: `/api/app/category/${id}/toggle-active-status`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCategoryDto, config?: Partial<Rest.Config>) => {
    const formData = this.createFormData(input);
    return this.restService.request<any, CategoryDto>({
      method: 'PUT',
      url: `/api/app/category/${id}`,
      body: formData,
    },
    { apiName: this.apiName,...config });
  }

  constructor(private restService: RestService) {}

  private createFormData(input: CreateUpdateCategoryDto): FormData {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', input.name || '');
    formData.append('description', input.description || '');
    formData.append('isActive', input.isActive?.toString() || 'false');
    formData.append('displayOrder', input.displayOrder?.toString() || '0');
    
    if (input.parentId) {
      formData.append('parentId', input.parentId);
    }
    
    // Add image file if exists
    if (input.image) {
      formData.append('image', input.image);
    }
    
    return formData;
  }
}
