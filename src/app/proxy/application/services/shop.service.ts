import type { CreateShopDto, ShopDto, UpdateShopDto, UpdateShopSettingsDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  apiName = 'Default';
  

  activate = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto>({
      method: 'POST',
      url: `/api/app/shop/${id}/activate`,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateShopDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto>({
      method: 'POST',
      url: '/api/app/shop',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deactivate = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto>({
      method: 'POST',
      url: `/api/app/shop/${id}/deactivate`,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/shop/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto>({
      method: 'GET',
      url: `/api/app/shop/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto[]>({
      method: 'GET',
      url: '/api/app/shop',
    },
    { apiName: this.apiName,...config });
  

  getPagedList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ShopDto>>({
      method: 'GET',
      url: '/api/app/shop/paged-list',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateShopDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto>({
      method: 'PUT',
      url: `/api/app/shop/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateSettings = (id: string, input: UpdateShopSettingsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto>({
      method: 'PUT',
      url: `/api/app/shop/${id}/settings`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
