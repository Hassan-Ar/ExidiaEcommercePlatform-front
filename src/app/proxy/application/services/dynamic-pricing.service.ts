import type { CreateDynamicPriceRuleDto, DynamicPriceRuleDto, SetRuleValidityPeriodDto, UpdateDynamicPriceRuleDto, UpdateRulePriorityDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicPricingService {
  apiName = 'Default';
  

  activate = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'POST',
      url: `/api/app/dynamic-pricing/${id}/activate`,
    },
    { apiName: this.apiName,...config });
  

  calculateDynamicPrice = (productId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'POST',
      url: `/api/app/dynamic-pricing/calculate-dynamic-price/${productId}`,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateDynamicPriceRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'POST',
      url: '/api/app/dynamic-pricing',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deactivate = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'POST',
      url: `/api/app/dynamic-pricing/${id}/deactivate`,
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
  

  getActiveRules = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto[]>({
      method: 'GET',
      url: '/api/app/dynamic-pricing/active-rules',
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto[]>({
      method: 'GET',
      url: '/api/app/dynamic-pricing',
    },
    { apiName: this.apiName,...config });
  

  getPagedList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DynamicPriceRuleDto>>({
      method: 'GET',
      url: '/api/app/dynamic-pricing/paged-list',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  setValidityPeriod = (id: string, input: SetRuleValidityPeriodDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'POST',
      url: `/api/app/dynamic-pricing/${id}/set-validity-period`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateDynamicPriceRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'PUT',
      url: `/api/app/dynamic-pricing/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updatePriority = (id: string, input: UpdateRulePriorityDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DynamicPriceRuleDto>({
      method: 'PUT',
      url: `/api/app/dynamic-pricing/${id}/priority`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
