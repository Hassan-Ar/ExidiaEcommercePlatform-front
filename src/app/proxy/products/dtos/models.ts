import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateProductDto {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  sku: string;
  image?: File;
  isActive: boolean;
  categoryId?: string;
  discountPercent?: number;
}

export interface ProductDto extends AuditedEntityDto<string> {
  name?: string;
  description?: string;
  price: number;
  stockQuantity: number;
  sku?: string;
  imageUrl?: string;
  isActive: boolean;
  categoryId?: string;
  discountPercent: number;
  rating: number;
  ratingCount: number;
}
