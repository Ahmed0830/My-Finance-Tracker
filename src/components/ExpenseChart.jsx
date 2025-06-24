import React from 'react';
import { PieChart as PieChart2} from 'lucide-react';
import {Pie, PieChart, Cell, Legend, Tooltip, ResponsiveContainer} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#546E7A', '#26a69a'];

const ExpenseChart = ({ expenses}) => {
    if (!expenses || expenses.length === 0) {
        return(<p>No records to display</p>)
    }
return(
    <div className='bg-white rounded-lg shadow-lg p-4'>   
    <h6 className='text-xl font-medium mt-2'>Spending Insights</h6>     
    <h6 className='text-xl font-medium mt-6'>This Month's Spending by Category</h6>
    <ResponsiveContainer width="100%" height = {400}>
        <PieChart>
            <Pie
            data = {expenses}
            dataKey = "amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            labelLine={false}
            label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
            >
                {expenses.map((entry, id) => (
                    <Cell key={`cell-${id}`} fill={COLORS[id % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip formatter={(amount) => `$${amount.toFixed(2)}`} />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
    <div>
    <h3 className="text-lg font-medium mt-4 mb-4">Quick Tips</h3>
    <div className='space-y-3 text-sm text-gray-600'>
        <div className='p-3 rounded-lg bg-blue-50'>
            <p className='font-medium text-blue-800'>
                Track Daily
            </p>
            <p>
            Enter expenses as they happen to get the most accurate picture of your spending.
            </p>
        </div>
        <div className='p-3 rounded-lg bg-green-50'>
            <p className='font-medium text-green-800'>
            Set Realistic Goals
            </p>
            <p>
            Start with smaller, achievable goals to build momentum and confidence.
            </p>
        </div>
        <div className='p-3 rounded-lg bg-yellow-50'>
            <p className='font-medium text-yellow-800'>
            Review Weekly
            </p>
            <p>
            Check your spending patterns weekly to identify areas for improvement.
            </p>
        </div>
    </div>
    </div>
    </div>
)
}

export default ExpenseChart