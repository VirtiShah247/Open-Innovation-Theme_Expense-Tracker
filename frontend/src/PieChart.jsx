import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Expenses by Category',
                data: Object.values(data),
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        weight: 'bold',
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: Rs. ${value}`;
                    },
                    labelTextColor: function () {
                        return '#fff'; // Set tooltip text color to black
                    },
                }
            },
        },
    };

    return (
        <div class="w-auto min-w-72">
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default PieChart;