import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routesService: RoutesService) {
  return () => {
    routesService.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/ecommerce',
        name: '::Menu:Ecommerce',
        iconClass: 'fas fa-store',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/products',
        name: '::Menu:Products',
        parentName: '::Menu:Ecommerce',
        iconClass: 'fas fa-box',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/orders',
        name: '::Menu:Orders',
        parentName: '::Menu:Ecommerce',
        iconClass: 'fas fa-shopping-cart',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/categories',
        name: '::Menu:Categories',
        parentName: '::Menu:Ecommerce',
        iconClass: 'fas fa-tags',
        order: 3,
        layout: eLayoutType.application,
      },
      {
        path: '/dashboard',
        name: '::Menu:Dashboard',
        parentName: '::Menu:Ecommerce',
        iconClass: 'fas fa-chart-line',
        order: 4,
        layout: eLayoutType.application,
      },
    ]);
  };
}
