import type { CartDto, CreateUpdateCartDto, CreateUpdateCartItemDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiName = 'Default';
  

  addItemToCart = (cartId: string, input: CreateUpdateCartItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CartDto>({
      method: 'POST',
      url: `/api/app/cart/item-to-cart/${cartId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  clearCart = (cartId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CartDto>({
      method: 'POST',
      url: `/api/app/cart/clear-cart/${cartId}`,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateCartDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CartDto>({
      method: 'POST',
      url: '/api/app/cart',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/cart/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CartDto>({
      method: 'GET',
      url: `/api/app/cart/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCartByUserId = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CartDto>({
      method: 'GET',
      url: `/api/app/cart/cart-by-user-id/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CartDto>>({
      method: 'GET',
      url: '/api/app/cart',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  removeItemFromCart = (cartItemId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CartDto>({
      method: 'DELETE',
      url: `/api/app/cart/item-from-cart/${cartItemId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCartDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CartDto>({
      method: 'PUT',
      url: `/api/app/cart/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateCartItemQuantity = (cartItemId: string, quantity: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CartDto>({
      method: 'PUT',
      url: `/api/app/cart/cart-item-quantity/${cartItemId}`,
      params: { quantity },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
