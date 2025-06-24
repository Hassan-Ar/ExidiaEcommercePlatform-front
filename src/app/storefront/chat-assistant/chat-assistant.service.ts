import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface ProductBriefDto {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  productPageUrl: string;
}

export interface ChatAssistantResponseDto {
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
  products: ProductBriefDto[];
}

export interface ChatAssistantRequestDto {
  sessionId?: string | null;
  userId?: string | null;
  message: string;
}

export interface AiChatSessionDto {
  id: string;
  sessionName?: string;
  lastActivityTime?: string;
}

export interface AiChatMessageDto {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ChatAssistantService {
  private apiRoot = environment.apis.default.url;
  private api = `${this.apiRoot}/api/app/chat-assistant`;

  constructor(private http: HttpClient) {}

  process(request: ChatAssistantRequestDto): Observable<ChatAssistantResponseDto> {
    return this.http.post<ChatAssistantResponseDto>(`${this.api}/process`, request);
  }

  processSimple(message: string): Observable<ChatAssistantResponseDto> {
    return this.http.post<ChatAssistantResponseDto>(`${this.api}/process-simple`, { message });
  }

  listSessions(): Observable<AiChatSessionDto[]> {
    return this.http.get<AiChatSessionDto[]>(`${this.apiRoot}/api/app/ai-chat?skipCount=0&maxResultCount=20`).pipe(map(r=>r['items'] ?? r));
  }

  getSessionMessages(sessionId: string): Observable<AiChatMessageDto[]> {
    return this.http.get<AiChatMessageDto[]>(`${this.apiRoot}/api/app/ai-chat/messages-by-session/${sessionId}`);
  }
} 