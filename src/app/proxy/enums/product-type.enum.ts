import { mapEnumToOptions } from '@abp/ng.core';

export enum ProductType {
  Physical = 0,
  Digital = 1,
  Service = 2,
  Subscription = 3,
}

export const productTypeOptions = mapEnumToOptions(ProductType);
