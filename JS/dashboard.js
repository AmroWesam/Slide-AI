/**
 * Slide AI - Dashboard JavaScript
 * Adds functionality to the dashboard interface
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            offset: 100,
            once: true
        });
    }

    // Initialize charts
    initializeCharts();
    
    // Initialize progress circles
    initializeProgressCircles();

    // Add event listeners
    addEventListeners();
});

/**
 * Initialize dashboard charts
 */
function initializeCharts() {
    // Performance chart (presentations over time)
    const performanceChart = document.getElementById('performanceChart');
    if (performanceChart) {
        const ctx = performanceChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Presentations',
                        data: [4, 6, 8, 12, 9, 12],
                        borderColor: '#4e43e0',
                        backgroundColor: 'rgba(78, 67, 224, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Audience Size',
                        data: [30, 45, 60, 85, 65, 90],
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Usage chart (gesture & voice usage over time)
    const usageChart = document.getElementById('usageChart');
    if (usageChart) {
        const ctx = usageChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Gesture Commands',
                        data: [25, 32, 28, 35],
                        backgroundColor: '#4e43e0',
                        borderRadius: 4
                    },
                    {
                        label: 'Voice Commands',
                        data: [18, 22, 24, 27],
                        backgroundColor: '#7b68ee',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Engagement chart (audience engagement metrics)
    const engagementChart = document.getElementById('engagementChart');
    if (engagementChart) {
        const ctx = engagementChart.getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Attention',
                    'Participation',
                    'Interaction',
                    'Interest',
                    'Retention',
                    'Feedback'
                ],
                datasets: [
                    {
                        label: 'Current Month',
                        data: [85, 72, 78, 90, 82, 88],
                        fill: true,
                        backgroundColor: 'rgba(78, 67, 224, 0.2)',
                        borderColor: '#4e43e0',
                        pointBackgroundColor: '#4e43e0',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#4e43e0'
                    },
                    {
                        label: 'Previous Month',
                        data: [78, 68, 70, 82, 75, 80],
                        fill: true,
                        backgroundColor: 'rgba(255, 107, 107, 0.2)',
                        borderColor: '#ff6b6b',
                        pointBackgroundColor: '#ff6b6b',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#ff6b6b'
                    }
                ]
            },
            options: {
                elements: {
                    line: {
                        tension: 0.1
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

/**
 * Initialize progress circles
 */
function initializeProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle');
    
    circles.forEach(circle => {
        const value = circle.getAttribute('data-value');
        circle.style.setProperty('--value', value);
    });
}

/**
 * Add event listeners for interactive elements
 */
function addEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Date picker
    const datePicker = document.querySelector('.date-picker');
    if (datePicker) {
        datePicker.addEventListener('click', () => {
            // In a real implementation, show a date picker dialog
            console.log('Date picker clicked');
        });
    }

    // Card action buttons
    const actionButtons = document.querySelectorAll('.card-action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action') || 'default';
            console.log(`Action button clicked: ${action}`);
            
            // In a real implementation, perform actions based on the button clicked
        });
    });

    // Table action buttons
    const tableActions = document.querySelectorAll('.table-actions .action-btn');
    tableActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = Array.from(this.closest('tr').parentNode.children).indexOf(this.closest('tr'));
            const action = this.querySelector('i').className;
            
            console.log(`Table action ${action} clicked for row ${index + 1}`);
            
            // In a real implementation, perform actions based on the button clicked
        });
    });

    // Filter select
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            console.log(`Filter changed to: ${this.value}`);
            
            // In a real implementation, filter the table based on the selected value
        });
    }

    // Feedback filter
    const feedbackFilter = document.querySelector('.feedback-filter');
    if (feedbackFilter) {
        feedbackFilter.addEventListener('change', function() {
            console.log(`Feedback filter changed to: ${this.value}`);
            
            // In a real implementation, sort/filter feedback based on the selected value
        });
    }

    // Presentation select for analytics
    const presentationSelect = document.querySelector('.presentation-select');
    if (presentationSelect) {
        presentationSelect.addEventListener('change', function() {
            console.log(`Selected presentation: ${this.value}`);
            
            // In a real implementation, update the analytics based on the selected presentation
        });
    }

    // View all links
    const viewAllLinks = document.querySelectorAll('.view-all');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                
                // In a real implementation, navigate to the specific section
                console.log(`Navigate to: ${target}`);
            }
        });
    });

    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // In a real implementation, show the corresponding section
                console.log(`Navigate to section: ${target}`);
            }
        });
    });
}
