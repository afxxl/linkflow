import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
} from 'chart.js';
import { lineChartOptions } from '../utils/chartConfig';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsChart = ({ data, title }) => {
    const chartData = {
        labels: data.map((d) => d.date),
        datasets: [
            {
                label: 'Clicks',
                data: data.map((d) => d.clicks),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
            },
        ],
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="h-64">
                <Line data={chartData} options={lineChartOptions} />
            </div>
        </div>
    );
};

export default AnalyticsChart;
