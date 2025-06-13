import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';

export interface AiChatMessageDto extends EntityDto<string> {
  sessionId?: string;
  role?: string;
  content?: string;
  timestamp?: string;
}

export interface AiChatSessionDto extends AuditedEntityDto<string> {
  sessionName?: string;
  userId?: string;
  messages: AiChatMessageDto[];
}

export interface CreateAiChatMessageDto {
  sessionId: string;
  role: string;
  content: string;
}

export interface CreateUpdateAiChatSessionDto {
  sessionName: string;
  userId: string;
}
