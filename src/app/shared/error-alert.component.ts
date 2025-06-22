import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  template: `
    <div *ngIf="message" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ message }}
      <button 
        type="button" 
        class="btn-close" 
        (click)="onClose()"
        aria-label="Close">
      </button>
    </div>
  `,
  styles: [`
    .alert {
      border-radius: 8px;
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border-left: 4px solid #dc3545;
    }
    
    .btn-close {
      opacity: 0.7;
    }
    
    .btn-close:hover {
      opacity: 1;
    }
  `]
})
export class ErrorAlertComponent {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
} 