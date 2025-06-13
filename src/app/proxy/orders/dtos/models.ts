import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';
import type { OrderStatus } from '../../enums/order-status.enum';

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateUpdateOrderDto {
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  billingAddress: string;
}

export interface OrderDto extends AuditedEntityDto<string> {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
  billingAddress?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus?: string;
  trackingNumber?: string;
  orderItems: OrderItemDto[];
}

export interface OrderItemDto extends EntityDto<string> {
  orderId?: string;
  productId?: string;
  productName?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
