import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateDynamicPriceRuleDto {
  name: string;
  ruleType: string;
  value: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface DynamicPriceRuleDto extends AuditedEntityDto<string> {
  name?: string;
  ruleType?: string;
  value: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}
