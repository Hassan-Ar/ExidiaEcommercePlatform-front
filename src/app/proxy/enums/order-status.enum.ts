import { mapEnumToOptions } from '@abp/ng.core';

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Completed = 4,
  Cancelled = 5,
  Returned = 6,
}

export const orderStatusOptions = mapEnumToOptions(OrderStatus);
