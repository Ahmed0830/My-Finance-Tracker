import React, {useState, useRef, useMemo, useEffect} from 'react';
import ExpenseChart from './ExpenseChart';
import GoalsForm from './GoalsForm';
import {TrendingDown, PlusCircle, PieChart, Goal} from 'lucide-react';
import ExpenseContext from '../contexts/context';
import QuickStats from './QuickStats';
const ExpenseForm = () => {
    const [expenses, setExpenses] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('expenses');
    const [goals, setGoals] = useState([]);
    const categories = [
        'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
    ];
    const amountRef = useRef();
    const categoryRef = useRef();
    const dateRef = useRef();

    const chartData = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const categoryTotals = expenses.reduce((acc, expense) => {
            const expenseDate = new Date(expense.date);
            const expenseMonth = expenseDate.getMonth();
            const expenseYear = expenseDate.getFullYear();
            if(expenseMonth === currentMonth && expenseYear === currentYear) {
                const { category, amount} = expense;
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += amount;
        }
            return acc;
        }, {});
        return Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            amount
        }));
    }, [expenses])

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/goals', {
                    method: 'GET', 
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if(response.status === 200){
                    setGoals(data || []);
                }
            } catch (err) {
                console.error('Error fetching goals:', err);
                setError('Error fetching goals. Please try again later.');
            }
        }
        fetchGoals();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');
    
        const amount = amountRef.current?.value || '';
        const category = categoryRef.current?.value || '';
        const date = dateRef.current?.value || new Date().toISOString().split('T')[0];

        if(!amount || !category) {
            setError('Please fill in all fields before adding an expense.');
            return;
        }
        if(parseFloat(amount) <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({amount, category, date})
            })
            const data = await response.json();
            setExpenses((prev) => [data.expense, ...prev]);
            setSuccessMessage(`Expense of $${amount} added successfully!`);
        } catch (err) {
            console.error('Error adding expense:', err);
            setError('Error adding expense. Please try again later.');
        }     
        
        amountRef.current.value = '';
        categoryRef.current.value = '';
        dateRef.current.value = '';
        setTimeout(() => {
            setSuccessMessage('');
        }, 4000)
    }
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);


    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/expenses', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if(response.status === 200) {
                    setExpenses(data || []);
                }
                console.log(data);
            } catch (err){
                console.error('Error fetching expenses:', err);
                setError('Error fetching expenses. Please try again later.');
            }
        }
        fetchExpenses();
    }, []);

    
    return (
        <ExpenseContext.Provider value={{expenses, setExpenses}}>
        <div className="min-h-screen p-4">
            <QuickStats goalCount = {goals.length}/>
            <div className="flex justify-between bg-gray-300 font-medium p-0 rounded-md mb-4">
            <div className='m-2 w-full text-center'>
            <button className= {`w-full rounded-md ${activeTab === 'expenses' ? `bg-white text-blue-500` : ''} p-2 m-0`}
             onClick={() => setActiveTab('expenses')}>
                <TrendingDown className='inline-block w-5 h-5 mr-2'/>Expenses</button>
        </div>
        <div className='focus:bg-blue-200 m-2 w-full text-center'>
            <button className= {`w-full rounded-md ${activeTab === 'goals' ? `bg-white text-blue-500` : ''} p-2 m-0`} onClick={() => setActiveTab('goals')}>
                <Goal className='inline-block w-5 h-5 mr-2'/>Goals</button>
        </div>
        <div className='focus:bg-blue-200 m-2 w-full text-center'>
            <button className= {`w-full rounded-md ${activeTab === 'chart' ? `bg-white text-blue-500` : ''} p-2 m-0`} onClick={() => setActiveTab('chart')}>
            <PieChart className='inline-block w-5 h-5 mr-2'/>Insights</button>
        </div>
        </div>
        {activeTab === 'expenses' && (
            <div>
            <div className='bg-white p-4 rounded-lg shadow-lg'>
            <h3 className="text-xl font-medium mb-6"><PlusCircle className='inline-block w-6 h-6 mr-2'/>Add Expense</h3>
            
            {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}
                    
            <form>
            <div>
                <label htmlFor = "expenseAmount" className="block text-gray-700 font-medium mb-2">
                    Amount ($):
                </label>
                <input
                ref = {amountRef}
        className='border border-gray-300 rounded-md p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
        type = "number"
        id="expenseAmount"
        placeholder="100"
        onKeyDown={(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault();
            }
          }}
          required
        />
        </div>
        <label htmlFor="expenseCategory" className="block text-gray-700 font-medium mb-2 ">Category: </label>
        <select ref = {categoryRef} id = "expenseCategory" className ='border border-gray-300 rounded-md p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-50' required>
            <option value = "" disabled>Select Category ...</option>
            { categories.map((category) => (
                <option key= {category} value = {category}>{category}</option>
            ))}
        </select>
        <label htmlFor="dateInput" className="block text-gray-700 font-medium mb-2">Date: </label>
        <input ref = {dateRef} type = "date" id="dateInput" className='border border-gray-300 rounded-md p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
        <button 
        className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        onClick = {handleAdd}>
        Add Expense
        </button>
            </form>
            </div>
        
            
            <div className='mt-4 border bg-white border-gray-200 p-4 rounded-md shadow-md'> 
                <h6 className='flex justify-between text-xl'>
                <p className='text-green-500 mb-2 font-medium '>Your Expenses </p>
                <div>
                <span className='text-gray-700'>Total: </span>
                <span className='text-red-700'>{`$${totalExpense.toFixed(2)}`}</span> </div></h6>
                {/* <h3 className="text-blue-500 text-xl font-bold mt-8 mb-4">Expense List:</h3> */}
                {expenses.length === 0 ? (
                    <p className="text-gray-500">No expenses added yet.</p>
                ) : (
                    <ul className="">
                        {expenses.map((expense) => (
                            
                            <li key={expense._id} className="mb-2 p-4 rounded-lg bg-gray-50">
                                <div className="flex justify-between">
                                <span className="font-semibold text-red-700">${expense.amount.toFixed(2)}</span> 
                                
                                <span className="ml-1">{expense.date !== null? new Date(expense.date).toLocaleDateString(): new Date().toLocaleDateString()}</span>
                                </div>
                                <span className="italic">{expense.category}</span>
                            </li>
                        ))}
                    </ul>
                )}
                
            </div>
            </div>
            )}
            {activeTab === 'goals' && (
                <GoalsForm goals = {goals} setGoals= {setGoals}/>
            )}
            {activeTab === 'chart' && (
                <div>
            <ExpenseChart expenses={chartData} />
            </div>
            )}
        </div>
        </ExpenseContext.Provider>
    )
}

export default ExpenseForm;