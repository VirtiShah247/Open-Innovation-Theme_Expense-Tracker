import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function LineChart({ data }) {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Expenses by Category',
                data: Object.values(data),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return `Rs. ${value}`;
                    },
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: $${value}`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: '25%' }}>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default LineChart;