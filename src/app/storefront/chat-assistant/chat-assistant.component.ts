import { Component, OnInit } from '@angular/core';
import { ChatAssistantService, ChatAssistantResponseDto, ProductBriefDto, AiChatSessionDto } from './chat-assistant.service';
import { ConfigStateService, AuthService } from '@abp/ng.core';

interface ChatMessageVM {
  role: 'user' | 'assistant';
  text: string;
  products?: ProductBriefDto[];
}

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.scss'],
})
export class ChatAssistantComponent implements OnInit {
  messages: ChatMessageVM[] = [];
  inputText = '';
  sessionId: string | null = null;
  isOpen = false;
  sessions: AiChatSessionDto[] = [];

  constructor(private chatService: ChatAssistantService, private authService: AuthService, private config: ConfigStateService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions() {
    this.chatService.listSessions().subscribe(s => (this.sessions = s));
  }

  selectSession(s: AiChatSessionDto) {
    this.sessionId = s.id;
    this.chatService.getSessionMessages(s.id).subscribe(msgs => {
      this.messages = msgs.map<ChatMessageVM>(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        text: m.content,
      }));
    });
    this.isOpen = true;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  send() {
    const text = this.inputText.trim();
    if (!text) return;

    this.messages.push({ role: 'user', text });
    this.inputText = '';

    this.chatService
      .process({ sessionId: this.sessionId, message: text })
      .subscribe((res: ChatAssistantResponseDto) => {
        this.sessionId = res.sessionId;
        this.messages.push({ role: 'assistant', text: res.assistantMessage, products: res.products });
      });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
} 