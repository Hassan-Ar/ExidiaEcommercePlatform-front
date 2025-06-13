import { mapEnumToOptions } from '@abp/ng.core';

export enum DynamicPriceRuleType {
  TimeBasedPricing = 0,
  InventoryBasedPricing = 1,
  DemandBasedPricing = 2,
  CompetitorBasedPricing = 3,
  CustomerSegmentPricing = 4,
  AiRecommendedPricing = 5,
}

export const dynamicPriceRuleTypeOptions = mapEnumToOptions(DynamicPriceRuleType);
