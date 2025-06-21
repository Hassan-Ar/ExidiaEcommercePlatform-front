import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { ProductService } from '../../proxy/products/product.service';
import { CategoryService } from '../../proxy/categories/category.service';
import { OrderService } from '../../proxy/orders/order.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">
          <i class="fas fa-chart-line me-2"></i>
          Dashboard Overview
        </h1>
        <div class="dashboard-date">
          {{ currentDate | date:'fullDate' }}
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalProducts }}</h3>
            <p>Total Products</p>
            <span class="stat-trend positive">
              <i class="fas fa-arrow-up"></i> {{ stats.activeProducts }} Active
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalOrders }}</h3>
            <p>Total Orders</p>
            <span class="stat-trend positive">
              <i class="fas fa-arrow-up"></i> {{ stats.pendingOrders }} Pending
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-warning">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stat-content">
            <h3>\${{ stats.totalRevenue | number:'1.2-2' }}</h3>
            <p>Total Revenue</p>
            <span class="stat-trend positive">
              <i class="fas fa-arrow-up"></i> +12.5%
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-info">
            <i class="fas fa-tags"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.totalCategories }}</h3>
            <p>Categories</p>
            <span class="stat-trend positive">
              <i class="fas fa-arrow-up"></i> {{ stats.activeCategories }} Active
            </span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="row">
          <!-- Sales Chart -->
          <div class="col-lg-8">
            <div class="chart-card">
              <div class="chart-header">
                <h4>Sales Overview</h4>
                <div class="chart-controls">
                  <select class="form-select" [(ngModel)]="selectedPeriod" (change)="updateSalesChart()">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>
              </div>
              <div class="chart-container">
                <canvas #salesChart width="400" height="200"></canvas>
              </div>
            </div>
          </div>

          <!-- Top Products Chart -->
          <div class="col-lg-4">
            <div class="chart-card">
              <div class="chart-header">
                <h4>Most Sold Products</h4>
              </div>
              <div class="chart-container">
                <canvas #topProductsChart width="400" height="200"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <!-- Revenue Chart -->
          <div class="col-lg-6">
            <div class="chart-card">
              <div class="chart-header">
                <h4>Monthly Revenue</h4>
              </div>
              <div class="chart-container">
                <canvas #revenueChart width="400" height="200"></canvas>
              </div>
            </div>
          </div>

          <!-- Category Distribution -->
          <div class="col-lg-6">
            <div class="chart-card">
              <div class="chart-header">
                <h4>Products by Category</h4>
              </div>
              <div class="chart-container">
                <canvas #categoryChart width="400" height="200"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="activities-section">
        <div class="card">
          <div class="card-header">
            <h4>Recent Activities</h4>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of recentActivities">
                <div class="activity-icon" [ngClass]="activity.type">
                  <i [class]="activity.icon"></i>
                </div>
                <div class="activity-content">
                  <p class="activity-text">{{ activity.message }}</p>
                  <span class="activity-time">{{ activity.time | date:'short' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 0;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .dashboard-title {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .dashboard-date {
      color: #6b7280;
      font-weight: 500;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }

    .stat-icon.bg-primary { background: #3b82f6; }
    .stat-icon.bg-success { background: #10b981; }
    .stat-icon.bg-warning { background: #f59e0b; }
    .stat-icon.bg-info { background: #06b6d4; }

    .stat-content h3 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #1f2937;
    }

    .stat-content p {
      margin: 0 0 8px 0;
      color: #6b7280;
      font-weight: 500;
    }

    .stat-trend {
      font-size: 14px;
      font-weight: 600;
    }

    .stat-trend.positive {
      color: #10b981;
    }

    .stat-trend.negative {
      color: #ef4444;
    }

    .charts-section {
      margin-bottom: 30px;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      height: 100%;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e5e7eb;
    }

    .chart-header h4 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .chart-controls select {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 14px;
    }

    .chart-container {
      position: relative;
      height: 300px;
    }

    .activities-section {
      margin-top: 30px;
    }

    .activity-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      flex-shrink: 0;
    }

    .activity-icon.order { background: #3b82f6; }
    .activity-icon.product { background: #10b981; }
    .activity-icon.user { background: #f59e0b; }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0 0 4px 0;
      color: #374151;
      font-weight: 500;
      line-height: 1.4;
    }

    .activity-time {
      color: #6b7280;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .chart-container {
        height: 250px;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart', { static: true }) salesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topProductsChart', { static: true }) topProductsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart', { static: true }) revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart', { static: true }) categoryChartRef!: ElementRef<HTMLCanvasElement>;

  currentDate = new Date();
  selectedPeriod = '30';

  stats = {
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    activeCategories: 0
  };

  recentActivities = [
    {
      type: 'order',
      icon: 'fas fa-shopping-cart',
      message: 'New order #1234 received from customer John Doe',
      time: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    {
      type: 'product',
      icon: 'fas fa-box',
      message: 'Product "Wireless Headphones" was updated',
      time: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
    },
    {
      type: 'user',
      icon: 'fas fa-user',
      message: 'New customer registered: Jane Smith',
      time: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
    },
    {
      type: 'order',
      icon: 'fas fa-truck',
      message: 'Order #1230 has been shipped',
      time: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
    }
  ];

  private chartInstances: any[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadChartLibrary();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after Chart.js is loaded
  }

  loadDashboardData(): void {
    // Load products
    this.productService.getList({ maxResultCount: 1000 }).subscribe({
      next: (response: any) => {
        const products = Array.isArray(response) ? response : (response?.items || []);
        this.stats.totalProducts = products.length;
        this.stats.activeProducts = products.filter((p: any) => p.isActive).length;
      },
      error: (error) => console.error('Error loading products:', error)
    });

    // Load categories
    this.categoryService.getList({ maxResultCount: 1000 }).subscribe({
      next: (response: any) => {
        const categories = Array.isArray(response) ? response : (response?.items || []);
        this.stats.totalCategories = categories.length;
        this.stats.activeCategories = categories.filter((c: any) => c.isActive).length;
      },
      error: (error) => console.error('Error loading categories:', error)
    });

    // Load orders
    this.orderService.getList({ maxResultCount: 1000 }).subscribe({
      next: (response: any) => {
        const orders = Array.isArray(response) ? response : (response?.items || []);
        this.stats.totalOrders = orders.length;
        this.stats.pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;
        this.stats.totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  private loadChartLibrary(): void {
    // Check if Chart.js is already loaded
    if ((window as any).Chart) {
      setTimeout(() => this.initializeCharts(), 100);
      return;
    }

    // Load Chart.js dynamically
    const script = this.document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      setTimeout(() => this.initializeCharts(), 100);
    };
    this.document.head.appendChild(script);
  }

  private initializeCharts(): void {
    if (!(window as any).Chart) {
      console.error('Chart.js not loaded');
      return;
    }

    this.createSalesChart();
    this.createTopProductsChart();
    this.createRevenueChart();
    this.createCategoryChart();
  }

  private createSalesChart(): void {
    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const Chart = (window as any).Chart;
    
    // Destroy existing chart
    const existingChart = this.chartInstances.find(c => c.canvas === ctx.canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.generateDateLabels(parseInt(this.selectedPeriod)),
        datasets: [{
          label: 'Sales',
          data: this.generateSalesData(parseInt(this.selectedPeriod)),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return '$' + value;
              }
            }
          }
        }
      }
    });

    this.chartInstances.push(chart);
  }

  private createTopProductsChart(): void {
    const ctx = this.topProductsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const Chart = (window as any).Chart;
    
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Laptops', 'Phones', 'Headphones', 'Accessories', 'Tablets'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    this.chartInstances.push(chart);
  }

  private createRevenueChart(): void {
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const Chart = (window as any).Chart;
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 15000, 18000, 14000, 22000, 25000],
          backgroundColor: '#10b981',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });

    this.chartInstances.push(chart);
  }

  private createCategoryChart(): void {
    const ctx = this.categoryChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const Chart = (window as any).Chart;
    
    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
        datasets: [{
          label: 'Products',
          data: [85, 60, 45, 70, 55],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6',
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

    this.chartInstances.push(chart);
  }

  updateSalesChart(): void {
    this.createSalesChart();
  }

  private generateDateLabels(days: number): string[] {
    const labels = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return labels;
  }

  private generateSalesData(days: number): number[] {
    const data = [];
    for (let i = 0; i < days; i++) {
      data.push(Math.random() * 1000 + 500);
    }
    return data;
  }
}