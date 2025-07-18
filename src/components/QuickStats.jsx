import React, {useContext} from 'react';
import ExpenseContext from '../contexts/context';
import { DollarSign, Target,  Calendar} from 'lucide-react';
const QuickStats = ({goalCount}) => {
    
    const {expenses} = useContext(ExpenseContext);
    const monthlySpent = (expenses) => {
        if (!expenses || expenses.length === 0) return 0;
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return expenses.reduce((total, expense) => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getMonth() === currentMonth && 
                expenseDate.getFullYear() === currentYear) {
                // Ensure both values are numbers
                return parseFloat(total) + parseFloat(expense.amount);
            }
            return parseFloat(total); // Ensure total stays a number
        }, 0); // Important: initial value of 0
    };
    return ( 
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div className='bg-white shadow-lg mb-6 p-6 rounded-xl'>
            
                <div className='flex justify-between items-start sm:items-center'>
                    <div>
                <p className='text-gray-500 text-sm'>This month spent</p>
                    <p className='text-2xl text-red-600 font-bold'>{'$' + monthlySpent(expenses).toFixed(2)}</p>
                    </div>
                    <span className='bg-red-100 rounded-full p-2 text-red-500'><DollarSign strokeWidth={2} size={28}/></span>
                </div>
                
            </div>
            <div className='bg-white shadow-lg mb-6 p-6 rounded-xl'>
            <div className='flex justify-between items-start sm:items-center'>
                <div>
                    <p className='text-gray-500 text-sm'>Total Transactions</p>
                    <p className='text-2xl text-blue-600 font-bold'>{expenses.length}</p>
                    </div>
                    <span className='bg-blue-100 rounded-full p-2 text-blue-500'><Calendar strokeWidth={2} size={28}/></span>
                </div>
            </div>
            <div className='bg-white shadow-lg mb-6 p-6 rounded-xl'>
            <div className='flex justify-between items-start sm:items-center'>
                <div>
                    <p className='text-gray-500 text-sm'>Active Goals</p>
                    <p className='text-2xl text-green-600 font-bold'>{goalCount}</p>
                    </div>
                    <span className='bg-green-100 rounded-full p-2 text-green-500'><Target strokeWidth={2} size={28}/></span>
                </div>
            </div>
            
        </div>
    )
}

export default QuickStats;