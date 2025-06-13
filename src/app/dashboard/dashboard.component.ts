import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="card">
      <div class="card-header">
        <h2>Dashboard</h2>
      </div>
      <div class="card-body">
        <h3>Welcome to the Dashboard</h3>
        <p>This is a placeholder for dashboard content.</p>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
} 