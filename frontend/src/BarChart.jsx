import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function BarChart({ expenses }) {
    const [filter, setFilter] = useState('month'); // Default filter is month
    const [barExpense, setBarExpense] = useState({});

    useEffect(() => {
        // Calculate total price for each month and year
        const totalMonthYearExpense = expenses?.reduce((acc, expense) => {
            const date = new Date(expense.date);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Correct month calculation
            const year = `${date.getFullYear()}`;

            if (filter === 'month') {
                if (acc[monthYear]) {
                    acc[monthYear] += expense.price;
                } else {
                    acc[monthYear] = expense.price;
                }
            } else {
                if (acc[year]) {
                    acc[year] += expense.price;
                } else {
                    acc[year] = expense.price;
                }
            }
            return acc;
        }, {});
        setBarExpense(totalMonthYearExpense);
    }, [filter, expenses]); // Re-run effect when filter or expenses change

    const chartData = {
        labels: Object.keys(barExpense),
        datasets: [
            {
                label: 'Expenses',
                data: Object.values(barExpense),
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
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return `Rs. ${value}`;
                    },
                    font: {
                        weight: 'bold',
                    },
                },
            },
            x: {
                ticks: {
                    font: {
                        weight: 'bold',
                    },
                },
            },
        },
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
                },
                titleFont: {
                    weight: 'bold',
                },
                bodyFont: {
                    weight: 'bold',
                },
            },
        },
    };

    return (
        <div class="w-auto min-w-72">
            <div class="mb-4">
            <label htmlFor="filter" class="mr-2 font-bold">Filter by: </label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 custom-select"
                >
                    <option value="month" class={filter === 'month' ? 'font-bold' : ''}>Month</option>
                    <option value="year" class={filter === 'year' ? 'font-bold' : ''}>Year</option>
                </select>
            </div>
            <Bar data={chartData} options={options} />
        </div>
    );
}

export default BarChart;