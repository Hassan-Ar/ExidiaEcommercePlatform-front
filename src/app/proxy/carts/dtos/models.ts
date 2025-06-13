import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';

export interface CartDto extends AuditedEntityDto<string> {
  userId?: string;
  totalPrice: number;
  items: CartItemDto[];
}

export interface CartItemDto extends EntityDto<string> {
  cartId?: string;
  productId?: string;
  productName?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateUpdateCartDto {
  userId: string;
}

export interface CreateUpdateCartItemDto {
  productId: string;
  quantity: number;
}
