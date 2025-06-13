import type { CreateOrderItemDto, CreateUpdateOrderDto, OrderDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { OrderStatus } from '../enums/order-status.enum';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiName = 'Default';
  

  addOrderItem = (orderId: string, input: CreateOrderItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'POST',
      url: `/api/app/order/order-item/${orderId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'POST',
      url: '/api/app/order',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/order/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'GET',
      url: `/api/app/order/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto[]>({
      method: 'GET',
      url: `/api/app/order/by-customer/${customerId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OrderDto>>({
      method: 'GET',
      url: '/api/app/order',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  removeOrderItem = (orderId: string, orderItemId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'DELETE',
      url: '/api/app/order/order-item',
      params: { orderId, orderItemId },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'PUT',
      url: `/api/app/order/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateOrderStatus = (id: string, status: OrderStatus, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'PUT',
      url: `/api/app/order/${id}/order-status`,
      params: { status },
    },
    { apiName: this.apiName,...config });
  

  updatePaymentStatus = (id: string, status: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'PUT',
      url: `/api/app/order/${id}/payment-status`,
      params: { status },
    },
    { apiName: this.apiName,...config });
  

  updateTrackingNumber = (id: string, trackingNumber: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OrderDto>({
      method: 'PUT',
      url: `/api/app/order/${id}/tracking-number`,
      params: { trackingNumber },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
