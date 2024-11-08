import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart';

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [categoryExpense, setCategoryExpense] = useState({});

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
                const categoryTotals = transformedExpenses.reduce((acc, expense) => {
                    if (acc[expense.category]) {
                        acc[expense.category] += expense.price;
                    } else {
                        acc[expense.category] = expense.price;
                    }
                    return acc;
                }, {});
                setCategoryExpense(categoryTotals);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <PieChart data={categoryExpense} />
            {
                console.log("expense: ", categoryExpense)
            }
            <h1>Transactions</h1>
            <ul>
                {expenses && expenses.map((expense, index) => (
                    <div key={index}>
                        <div>
                            <p>Date: {expense.date}</p>
                            <p>Category: {expense.category}</p>
                            <p>Price: {expense.price}</p>
                            <p>Description: {expense.description}</p>
                        </div>
                        <br />
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default Expenses;