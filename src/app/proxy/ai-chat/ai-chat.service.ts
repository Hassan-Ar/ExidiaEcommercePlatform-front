import type { AiChatMessageDto, AiChatSessionDto, CreateAiChatMessageDto, CreateUpdateAiChatSessionDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  apiName = 'Default';
  

  addMessageToSession = (sessionId: string, input: CreateAiChatMessageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatMessageDto>({
      method: 'POST',
      url: `/api/app/ai-chat/message-to-session/${sessionId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateAiChatSessionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto>({
      method: 'POST',
      url: '/api/app/ai-chat',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/ai-chat/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto>({
      method: 'GET',
      url: `/api/app/ai-chat/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AiChatSessionDto>>({
      method: 'GET',
      url: '/api/app/ai-chat',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getMessagesBySession = (sessionId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatMessageDto[]>({
      method: 'GET',
      url: `/api/app/ai-chat/messages-by-session/${sessionId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateAiChatSessionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AiChatSessionDto>({
      method: 'PUT',
      url: `/api/app/ai-chat/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
