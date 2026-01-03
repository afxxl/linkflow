export const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            borderRadius: 8,
            titleFont: {
                size: 14,
                weight: '600',
            },
            bodyFont: {
                size: 13,
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 11,
                },
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
                font: {
                    size: 11,
                },
                precision: 0,
            },
        },
    },
};

export const lineChartOptions = {
    ...chartConfig,
    elements: {
        line: {
            tension: 0.4,
            borderWidth: 2,
        },
        point: {
            radius: 4,
            hoverRadius: 6,
            hitRadius: 10,
        },
    },
};

export const barChartOptions = {
    ...chartConfig,
    elements: {
        bar: {
            borderRadius: 6,
        },
    },
};

export const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 15,
                font: {
                    size: 12,
                },
            },
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            borderRadius: 8,
        },
    },
};
