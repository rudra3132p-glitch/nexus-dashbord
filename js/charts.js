/* ============================================
   NEXUS DASHBOARD — Chart.js Configurations
   ============================================ */

const Charts = (() => {
  // ── Custom Colors ──
  const colors = {
    cyan: '#00e5ff',
    cyanAlpha: 'rgba(0, 229, 255, 0.15)',
    violet: '#7c3aed',
    violetAlpha: 'rgba(124, 58, 237, 0.15)',
    magenta: '#e040fb',
    magentaAlpha: 'rgba(224, 64, 251, 0.15)',
    green: '#22c55e',
    greenAlpha: 'rgba(34, 197, 94, 0.15)',
    gridLine: 'rgba(255, 255, 255, 0.04)',
    tickColor: '#64748b',
    tooltipBg: 'rgba(10, 10, 15, 0.95)',
  };

  // ── Revenue data for each range ──
  const revenueData = {
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      revenue: [5200, 6800, 7100, 5900, 8400, 9200, 6100],
      expenses: [3100, 4200, 4500, 3600, 5100, 5800, 3900],
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      revenue: [18200, 22500, 19800, 28400, 25600, 31200, 29800, 35400, 32100, 38700, 41200, 48759],
      expenses: [12400, 14200, 13600, 16800, 15400, 18200, 17600, 20100, 18900, 22400, 24100, 27300],
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
      revenue: [240000, 285000, 320000, 380000, 440000, 487590],
      expenses: [160000, 190000, 210000, 250000, 290000, 320000],
    },
  };

  let revenueChartInstance = null;

  // ── Chart.js Global Defaults ──
  function setGlobalDefaults() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = colors.tickColor;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    Chart.defaults.plugins.tooltip = {
      ...Chart.defaults.plugins.tooltip,
      backgroundColor: colors.tooltipBg,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 10,
      padding: 12,
      titleFont: { size: 13, weight: '600' },
      bodyFont: { size: 12 },
      caretSize: 6,
      displayColors: true,
      boxPadding: 4,
    };
  }

  // ── Revenue Line/Area Chart ──
  function createRevenueChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const data = revenueData.monthly;

    const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
    gradient1.addColorStop(1, 'rgba(0, 229, 255, 0)');

    const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(124, 58, 237, 0.15)');
    gradient2.addColorStop(1, 'rgba(124, 58, 237, 0)');

    revenueChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Revenue',
            data: data.revenue,
            borderColor: colors.cyan,
            backgroundColor: gradient1,
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: colors.cyan,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          },
          {
            label: 'Expenses',
            data: data.expenses,
            borderColor: colors.violet,
            backgroundColor: gradient2,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: colors.violet,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          }
        ]
      },
      options: {
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            grid: {
              color: colors.gridLine,
              drawBorder: false,
            },
            ticks: {
              padding: 8,
            },
          },
          y: {
            grid: {
              color: colors.gridLine,
              drawBorder: false,
            },
            ticks: {
              padding: 12,
              callback: (value) => '$' + (value / 1000).toFixed(0) + 'k',
            },
            beginAtZero: true,
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return ` ${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
              }
            }
          }
        }
      }
    });

    return revenueChartInstance;
  }

  // ── Update Revenue Chart by range ──
  function updateRevenueChart(range) {
    if (!revenueChartInstance || !revenueData[range]) return;

    const data = revenueData[range];
    revenueChartInstance.data.labels = data.labels;
    revenueChartInstance.data.datasets[0].data = data.revenue;
    revenueChartInstance.data.datasets[1].data = data.expenses;

    // Update Y axis tick format for yearly (values are larger)
    if (range === 'yearly') {
      revenueChartInstance.options.scales.y.ticks.callback = (value) => '$' + (value / 1000).toFixed(0) + 'k';
    } else {
      revenueChartInstance.options.scales.y.ticks.callback = (value) => '$' + (value / 1000).toFixed(0) + 'k';
    }

    revenueChartInstance.update('active');
  }

  // ── Traffic Sources Doughnut Chart ──
  function createTrafficChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Direct', 'Organic', 'Referral', 'Social'],
        datasets: [{
          data: [35, 28, 22, 15],
          backgroundColor: [colors.cyan, colors.violet, colors.magenta, colors.green],
          borderColor: 'rgba(10, 10, 15, 0.8)',
          borderWidth: 3,
          hoverOffset: 8,
          borderRadius: 4,
        }]
      },
      options: {
        cutout: '72%',
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
          animateRotate: true,
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return ` ${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      }
    });
  }

  // ── Sparkline Mini Charts ──
  function createSparkline(canvasId, data, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 32);
    gradient.addColorStop(0, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, 'transparent');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: gradient,
          borderWidth: 1.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        }]
      },
      options: {
        animation: { duration: 1000, easing: 'easeOutQuart' },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
        interaction: { intersect: false },
      }
    });
  }

  // ── Analytics Page: Visitor Analytics (Bar Chart) ──
  function createAnalyticsChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0.05)');

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'],
        datasets: [{
          label: 'Page Views',
          data: [1200, 1900, 1500, 2200, 1800, 2600, 2100, 3100, 2800, 3500, 3200, 3800, 3400, 4100, 3900],
          backgroundColor: gradient,
          borderColor: colors.cyan,
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        animation: { duration: 1500, easing: 'easeOutQuart' },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: colors.gridLine }, beginAtZero: true }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
            }
          }
        }
      }
    });
  }

  // ── Analytics Page: Device Breakdown (Doughnut) ──
  function createDeviceChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
          data: [58, 32, 10],
          backgroundColor: [colors.cyan, colors.violet, colors.magenta],
          borderColor: 'rgba(10, 10, 15, 0.8)',
          borderWidth: 3,
          hoverOffset: 8,
          borderRadius: 4,
        }]
      },
      options: {
        cutout: '76%',
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
          animateRotate: true,
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    });
  }

  function init() {
    setGlobalDefaults();

    // Revenue chart
    createRevenueChart('revenueChart');

    // Traffic doughnut
    createTrafficChart('trafficChart');

    // Sparklines
    createSparkline('sparkline1', [20, 25, 18, 30, 28, 35, 32, 40, 38, 45, 42, 48], '#00e5ff');
    createSparkline('sparkline2', [150, 180, 160, 200, 220, 190, 240, 260, 250, 270, 280, 284], '#7c3aed');
    createSparkline('sparkline3', [80, 90, 85, 100, 110, 105, 120, 130, 140, 155, 170, 184], '#e040fb');
    createSparkline('sparkline4', [99.5, 99.8, 99.7, 99.9, 99.6, 99.8, 99.9, 99.95, 99.92, 99.96, 99.97, 99.98], '#22c55e');

    // Analytics Page Charts
    createAnalyticsChart('analyticsChart');
    createDeviceChart('deviceChart');
  }

  return { init, updateRevenueChart };
})();
