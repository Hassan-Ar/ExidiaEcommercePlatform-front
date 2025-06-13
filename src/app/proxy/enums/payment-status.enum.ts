import { mapEnumToOptions } from '@abp/ng.core';

export enum PaymentStatus {
  Pending = 0,
  Authorized = 1,
  Completed = 2,
  Refunded = 3,
  Failed = 4,
  Cancelled = 5,
}

export const paymentStatusOptions = mapEnumToOptions(PaymentStatus);
