import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart';
import LineChart from './LineChart';
import BarChart from './BarChart';

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [pieExpense, setPieExpense] = useState({});
    const [barExpense, setBarExpense] = useState({});

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/get-expenses')
            .then(response => {
                const data = response.data;
                const transformedExpenses = Object.keys(data.date).map(key => ({
                    date: data.date[key],
                    category: data.category[key],
                    price: data.expense[key],
                    description: data.description[key]
                }));
                setExpenses(transformedExpenses);
                const totalCategoryExpense = transformedExpenses.reduce((acc, expense) => {
                    if (acc[expense.category]) {
                        acc[expense.category] += expense.price;
                    } else {
                        acc[expense.category] = expense.price;
                    }
                    return acc;
                }, {});
                setPieExpense(totalCategoryExpense);
                const totalMonthYearExpense = transformedExpenses.reduce((acc, expense) => {
                    if (acc[expense.date]) {
                        acc[expense.date] += expense.price;
                    } else {
                        acc[expense.date] = expense.price;
                    }
                    return acc;
                }, {});
                setBarExpense(totalMonthYearExpense);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1 class="font-semibold text-xl text-center">Dashboard</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-2 max-h-screen">
                <PieChart data={pieExpense} />
                <BarChart expenses={expenses} />
            </div>
            {/* <LineChart data={categoryExpense} /> */}
            <table class="table-auto border-collapse w-full">
                <caption class="caption-top font-semibold text-xl">
                    Transactions
                </caption>
                <thead>
                    <tr>
                        <th class="border border-slate-600 bg-slate-300">Date</th>
                        <th class="border border-slate-600 bg-slate-300">Category</th>
                        <th class="border border-slate-600 bg-slate-300">Description</th>
                        <th class="border border-slate-600 bg-slate-300">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses && expenses.map((expense, index) => (
                        index%2 === 0 ?
                        <tr key={index}>
                            <td class="border border-slate-300 bg-slate-200  p-2">{expense.date}</td>
                            <td class="border border-slate-300 bg-slate-200 p-2">{expense.category}</td>
                            <td class="border border-slate-300 bg-slate-200 p-2">{expense.price}</td>
                            <td class="border border-slate-300 bg-slate-200 p-2">{expense.description}</td>
                        </tr> : <tr key={index}>
                            <td class="border border-slate-300 p-2">{expense.date}</td>
                            <td class="border border-slate-300 p-2">{expense.category}</td>
                            <td class="border border-slate-300 p-2">{expense.price}</td>
                            <td class="border border-slate-300 p-2">{expense.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Expenses;