import type { EntityDto } from '@abp/ng.core';
import type { DynamicPriceRuleType } from '../../enums/dynamic-price-rule-type.enum';
import type { ProductType } from '../../enums/product-type.enum';
import type { OrderStatus } from '../../enums/order-status.enum';
import type { PaymentStatus } from '../../enums/payment-status.enum';

export interface AddAiChatMessageDto {
  content?: string;
}

export interface AddAiChatResponseDto {
  content?: string;
  metadata?: string;
}

export interface AiChatMessageDto extends EntityDto<string> {
  sessionId?: string;
  isFromUser: boolean;
  content?: string;
  metadata?: string;
  creationTime?: string;
}

export interface AiChatSessionDto extends EntityDto<string> {
  userId?: string;
  sessionIdentifier?: string;
  isActive: boolean;
  lastActivityTime?: string;
  metadata?: string;
  creationTime?: string;
}

export interface CancelOrderDto {
  notes?: string;
}

export interface CategoryDto extends EntityDto<string> {
  name?: string;
  description?: string;
  parentCategoryId?: string;
  displayOrder: number;
  slug?: string;
  imageUrl?: string;
  isActive: boolean;
  creationTime?: string;
}

export interface CreateAiChatSessionDto {
  userId?: string;
}

export interface CreateCategoryDto {
  name?: string;
  description?: string;
  parentCategoryId?: string;
}

export interface CreateDynamicPriceRuleDto {
  name?: string;
  description?: string;
  ruleType: DynamicPriceRuleType;
  ruleParameters?: string;
}

export interface CreateOrderDto {
  customerId?: string;
  items: CreateOrderItemDto[];
  shippingAddress?: string;
  billingAddress?: string;
  customerNotes?: string;
}

export interface CreateOrderItemDto {
  productId?: string;
  quantity: number;
  discountAmount: number;
  itemOptions?: string;
}

export interface CreateProductDto {
  name?: string;
  description?: string;
  basePrice: number;
  categoryId?: string;
  productType: ProductType;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags?: string;
}

export interface CreateShopDto {
  name?: string;
  description?: string;
  logoUrl?: string;
}

export interface DynamicPriceRuleDto extends EntityDto<string> {
  name?: string;
  description?: string;
  ruleType: DynamicPriceRuleType;
  ruleParameters?: string;
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  creationTime?: string;
}

export interface OrderDto extends EntityDto<string> {
  orderNumber?: string;
  customerId?: string;
  status: OrderStatus;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentTransactionId?: string;
  shippingAddress?: string;
  billingAddress?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  customerNotes?: string;
  adminNotes?: string;
  creationTime?: string;
  items: OrderItemDto[];
}

export interface OrderItemDto extends EntityDto<string> {
  orderId?: string;
  productId?: string;
  productName?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountAmount: number;
  itemOptions?: string;
}

export interface ProductDto extends EntityDto<string> {
  name?: string;
  description?: string;
  basePrice: number;
  dynamicPrice: number;
  stockQuantity: number;
  isPublished: boolean;
  categoryId?: string;
  productType: ProductType;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags?: string;
  creationTime?: string;
}

export interface SetRuleValidityPeriodDto {
  startDate?: string;
  endDate?: string;
}

export interface ShippingUpdateDto {
  shippingMethod?: string;
  trackingNumber?: string;
}

export interface ShopDto extends EntityDto<string> {
  name?: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  contactEmail?: string;
  contactPhone?: string;
  defaultCurrency?: string;
  defaultLanguage?: string;
  creationTime?: string;
}

export interface UpdateAiChatSessionMetadataDto {
  metadata?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentCategoryId?: string;
  displayOrder: number;
  imageUrl?: string;
}

export interface UpdateDynamicPriceRuleDto {
  name?: string;
  description?: string;
  ruleType: DynamicPriceRuleType;
  ruleParameters?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface UpdatePaymentStatusDto {
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  basePrice: number;
  categoryId?: string;
  weight?: number;
  dimensions?: string;
  tags?: string;
}

export interface UpdateProductStockDto {
  stockQuantity: number;
}

export interface UpdateRulePriorityDto {
  priority: number;
}

export interface UpdateShopDto {
  name?: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdateShopSettingsDto {
  defaultCurrency?: string;
  defaultLanguage?: string;
  contactEmail?: string;
  contactPhone?: string;
}
