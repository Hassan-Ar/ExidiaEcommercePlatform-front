import type { CreateUpdateShopDto, ShopDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  apiName = 'Default';
  

  create = (input: CreateUpdateShopDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto>({
      method: 'POST',
      url: '/api/app/shop',
      body: input,
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
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ShopDto>>({
      method: 'GET',
      url: '/api/app/shop',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateShopDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ShopDto>({
      method: 'PUT',
      url: `/api/app/shop/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
