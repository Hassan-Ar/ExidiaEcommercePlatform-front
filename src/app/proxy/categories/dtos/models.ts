import type { AuditedEntityDto } from '@abp/ng.core';

export interface CategoryDto extends AuditedEntityDto<string> {
  name?: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  parentCategoryId?: string;
  displayOrder: number;
}

export interface CreateUpdateCategoryDto {
  name: string;
  description?: string;
  image?: File;
  isActive: boolean;
  parentId?: string;
  displayOrder: number;
}
