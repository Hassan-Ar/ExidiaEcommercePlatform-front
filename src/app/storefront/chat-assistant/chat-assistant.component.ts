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
  isTyping = false;

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
    if (!text || this.isTyping) return;

    this.messages.push({ role: 'user', text });
    this.inputText = '';
    this.isTyping = true;

    this.chatService
      .process({ sessionId: this.sessionId, message: text })
      .subscribe({
        next: (res: ChatAssistantResponseDto) => {
          this.sessionId = res.sessionId;
          this.messages.push({ role: 'assistant', text: res.assistantMessage, products: res.products });
          this.isTyping = false;
          
          // Refresh sessions list to show new session
          if (!this.sessions.find(s => s.id === res.sessionId)) {
            this.loadSessions();
          }
        },
        error: (err) => {
          console.error('Chat error:', err);
          this.messages.push({ 
            role: 'assistant', 
            text: 'Sorry, I encountered an error. Please try again.' 
          });
          this.isTyping = false;
        }
      });
  }

  sendQuickMessage(message: string) {
    this.inputText = message;
    this.send();
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
} 