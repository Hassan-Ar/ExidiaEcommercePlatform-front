import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductDto } from '../../proxy/products/dtos/models';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.css']
})
export class ProductDetailModalComponent {
  @Input() product: ProductDto | null = null;
  @Output() close = new EventEmitter<void>();

  hide(): void {
    this.close.emit();
  }
} 