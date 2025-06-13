import type { CreateUpdateDynamicPriceRuleDto, DynamicPriceRuleDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicPricingService {
  apiName = 'Default';
  

  create = (input: CreateUpdateDynamicPriceRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'POST',
      url: '/api/app/dynamic-pricing',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/dynamic-pricing/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'GET',
      url: `/api/app/dynamic-pricing/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DynamicPriceRuleDto>>({
      method: 'GET',
      url: '/api/app/dynamic-pricing',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDynamicPriceRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'PUT',
      url: `/api/app/dynamic-pricing/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
