import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateShopDto {
  name: string;
  description?: string;
  sellerId: string;
  isActive: boolean;
}

export interface ShopDto extends AuditedEntityDto<string> {
  name?: string;
  description?: string;
  sellerId?: string;
  isActive: boolean;
}
