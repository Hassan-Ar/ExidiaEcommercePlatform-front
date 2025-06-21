import { Component, OnInit } from '@angular/core';
import { ReplaceableComponentsService } from '@abp/ng.core';
import { eThemeLeptonXComponents } from '@abp/ng.theme.lepton-x';
import { PublicLayoutComponent } from './layouts/public-layout.component';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout.component';
import { LayoutSelectorService } from './layouts/layout-selector.service';

@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar></abp-loader-bar>
    <div *ngIf="layoutInfo$ | async as layout">
      <!-- Admin Layout -->
      <ng-container *ngIf="layout.isAdminLayout">
        <router-outlet></router-outlet>
      </ng-container>
      
      <!-- Store Layout -->
      <ng-container *ngIf="layout.isStoreLayout">
        <router-outlet></router-outlet>
      </ng-container>
      
      <!-- Public/Default Layout (ABP Dynamic Layout) -->
      <ng-container *ngIf="layout.isPublicLayout">
        <abp-dynamic-layout></abp-dynamic-layout>
      </ng-container>
    </div>
  `,
})
export class AppComponent implements OnInit {
  layoutInfo$ = this.layoutSelector.getLayoutInfo();
  
  constructor(
    private replaceableComponents: ReplaceableComponentsService,
    private layoutSelector: LayoutSelectorService
  ) {}

  ngOnInit(): void {
    this.replaceableComponents.add({
      component: PublicLayoutComponent,
      key: eThemeLeptonXComponents.ApplicationLayout,
    });
  }
}
