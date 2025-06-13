import type { AddAiChatMessageDto, AddAiChatResponseDto, AiChatMessageDto, AiChatSessionDto, CreateAiChatSessionDto, UpdateAiChatSessionMetadataDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  apiName = 'Default';
  

  addAiResponse = (sessionId: string, input: AddAiChatResponseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatMessageDto>({
      method: 'POST',
      url: `/api/app/ai-chat/ai-response/${sessionId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  addUserMessage = (sessionId: string, input: AddAiChatMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatMessageDto>({
      method: 'POST',
      url: `/api/app/ai-chat/user-message/${sessionId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createSession = (input: CreateAiChatSessionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto>({
      method: 'POST',
      url: '/api/app/ai-chat/session',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deactivateSession = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto>({
      method: 'POST',
      url: `/api/app/ai-chat/${id}/deactivate-session`,
    },
    { apiName: this.apiName,...config });
  

  getPagedSessions = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AiChatSessionDto>>({
      method: 'GET',
      url: '/api/app/ai-chat/paged-sessions',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getSession = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto>({
      method: 'GET',
      url: `/api/app/ai-chat/${id}/session`,
    },
    { apiName: this.apiName,...config });
  

  getSessionMessages = (sessionId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatMessageDto[]>({
      method: 'GET',
      url: `/api/app/ai-chat/session-messages/${sessionId}`,
    },
    { apiName: this.apiName,...config });
  

  getSessionsByUser = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto[]>({
      method: 'GET',
      url: `/api/app/ai-chat/sessions-by-user/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  reactivateSession = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto>({
      method: 'POST',
      url: `/api/app/ai-chat/${id}/reactivate-session`,
    },
    { apiName: this.apiName,...config });
  

  updateSessionMetadata = (id: string, input: UpdateAiChatSessionMetadataDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto>({
      method: 'PUT',
      url: `/api/app/ai-chat/${id}/session-metadata`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
