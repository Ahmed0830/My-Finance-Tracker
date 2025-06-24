import React, {useState, useRef} from 'react'
import { Target, Trash2 } from 'lucide-react';  

const GoalsForm = ({goals, setGoals}) => {

// const [goals, setGoals] = useState([]);
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');

const currentRef = useRef();
const targetRef = useRef();
const goalRef = useRef();
const dateRef = useRef();
const updateRefs = useRef({});

// useEffect(() => {
//     goalCount(goals.length);
// }, [goals, goalCount]);
// useEffect(() => {
//     const fetchGoals = async () => {
//         try {
//             const response = await fetch('http://localhost:3000/api/goals', {
//                 method: 'GET', 
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             const data = await response.json();
//             if(response.status === 200){
//                 setGoals(data || []);
//             }
//         } catch (err) {
//             console.error('Error fetching goals:', err);
//             setError('Error fetching goals. Please try again later.');
//         }
//     }
//     fetchGoals();
// }, []);
const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    const current = currentRef.current?.value || '';
    const target = targetRef.current?.value || '';
    const goal = goalRef.current?.value || '';
    const date = dateRef.current?.value || '';
    if(!current || !target || !goal) {
        setError('Please fill in all the fields before adding a goal.');
        return;
    }
    if(parseFloat(target) <= parseFloat(current)) {
        setError('Target must be greater than current value.');
        return;
    }
    try {
    const response = await fetch('http://localhost:3000/api/goals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({current, target, goal, date})
    })
    const data = await response.json();
    if (response.status === 201) {
        setGoals((prev) => [data.newGoal, ...prev]);
        setSuccessMessage(`Goal "${goal} " added successfully!`);
    }
} catch (err) {
    console.error('Error adding goal:', err);
    setError('Error adding goal. Please try again later.');
}
    // const newGoal = {
    //     id: Date.now(),
    //     current: parseFloat(current),
    //     target: parseFloat(target),
    //     goal,
    //     date,
    //     createdAt: new Date().toISOString(),
    // }
    // setGoals(goals => [newGoal, ...goals]);
    
    currentRef.current.value = '';
    targetRef.current.value = '';
    goalRef.current.value = '';
    dateRef.current.value = '';
    setTimeout(() => {
        setSuccessMessage('');
    }, 4000);
}
const handleDelete = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/goals/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.status === 200) {
            setSuccessMessage('Goal deleted successfully.');
        }
        if(response.status === 404) {
            setError('Goal not found.');
        }
        setGoals(goals => goals.filter(goal => goal._id !== id));
    } catch (err) {
        console.error('Error deleting goal:', err);
        setError('Error deleting goal. Please try again later.');
    }
    
}

const handleUpdate = async (id) => {
    setError('');
    setSuccessMessage('');
    const updateAmount = updateRefs.current[id]?.value || '';
    if(!updateAmount) {
        setError('Please enter an amount to update.');
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/goals/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({current: parseFloat(updateAmount)})
        })
        if (response.status === 200) {
            setSuccessMessage('Goal updated successfully.');
            setGoals(goals => goals.map(goal => goal._id === id ? {...goal, current: parseFloat(updateAmount) || goal.current} : goal));
        }
        updateRefs.current[id].value = '';
        setTimeout(() => {
            setSuccessMessage('');

        }, 4000);
        
    } catch (err) {
        console.error('Error updating goal:', err);
        setError('Error updating goal. Please try again later.');
    }
    
}
return (
    <div>
    <div className='bg-white rounded-lg shadow-lg p-4'>
        <h6 className='text-xl mb-3 font-medium'><Target className='inline-block w-6 h-6 mr-2'/>Add Savings Goal</h6>
        {error && (
            <div className='bg-red-100 text-red-700 p-2 rounded-md mb-4'>
                {error}
                </div>
        )}
        {successMessage && (
            <div className='bg-green-100 text-green-700 p-2 rounded-md mb-4'>
                {successMessage}
                </div>
        )}
        <form>
            <label htmlFor = "goal" className='inline-block text-gray-700 font-medium mb-2'>Goal Name</label>
            <input type = "text" id = "goal"
            ref = {goalRef}
            placeholder = "House, Car, Vacation ..."
            className='border border-gray-300 rounded-md p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required />
            <label htmlFor = "current" className='inline-block text-gray-700 font-medium mb-2'>Current Amount ($)</label>
            <input type = "number" id = "current"
            ref = {currentRef}
            placeholder='0.00'
            className='border border-gray-300 rounded-md p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            onKeyDown={(e) => {
                if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
            required />
            <label htmlFor = "target" className='inline-block text-gray-700 font-medium mb-2'>Target Amount ($)</label>
            <input type = "number" id = "target"
            ref = {targetRef}
            placeholder='1000.00'
            className='border border-gray-300 rounded-md p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            onKeyDown={(e) => {
                if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
            required />
            <label htmlFor = "date" className='inline-block text-gray-700 font-medium mb-2'>Target Date (optional)</label>
            <input type = "date" 
            ref = {dateRef}
            id = "date"
            className='border border-gray-300 rounded-md p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        </form>
        <button 
        className='w-full bg-blue-500 rounded-md mt-2 mb-4 p-2 text-white font-medium'
        onClick={handleAdd}>
        Add Goal
        </button>
    </div>
    <div className = "mt-4 bg-white rounded-lg shadow-lg p-6">
        <h6 className='text-xl font-medium'>Your Goals</h6>
        {goals.length === 0 && (
            <p className='text-gray-500'>No goals added yet. Start by adding a goal above!</p>)}
            {goals.length > 0 && (
                <ul>
                    {goals.map((goal) => (
                        <li key = {goal._id}
                        className='bg-gray-50 mt-2 p-3 mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200'
                        >
                            <div className='flex justify-between'>
                            <span className='font-medium'>{goal.goal}</span>
                            <button 
                            className='text-red-500 hover:text-red-700 transition-colors'
                            onClick = {() => handleDelete(goal._id)}>
                                <Trash2 className='w-5 h-5'/>
                            </button>
                            </div>
                            
                            <div className='flex justify-between mt-1'>
                            <span className='text-gray-500 text-sm'>{`$${goal.current.toFixed(2)} of $${goal.target.toFixed(2)}`}</span>
                            <span className='text-gray-500 text-sm'>{((goal.current.toFixed(2) / goal.target.toFixed(2))*100).toFixed(2) + "%"}</span>
                            </div>
                            <div className= 'w-full bg-gray-200 h-2 rounded-lg'>
                            <div 
                            className='bg-blue-500 h-2 rounded-lg transition-all duration-500'
                            style = {{width: `${Math.min((goal.current / goal.target) * 100, 100)}%`}}></div>
                            </div>
                                {goal.date && (
                                    <p className='text-sm text-gray-500 mb-2'>Target Date: {new Date(goal.date).toLocaleDateString()}</p>
                                )}
                            <div>
                            <input type = "number" id = "updateCurrent"
                            ref = {(el) => (updateRefs.current[goal._id] = el)}
                            placeholder='Update amount'
                            className='border border-gray-300 rounded-md p-1 w-4/5 mb-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            onKeyDown={(e) => {
                if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}

            required />
            <button className='w-1/6 text-white bg-blue-500 rounded-md ml-3 p-1' onClick={() => handleUpdate(goal._id)}>Update</button>
                            </div>
                           
                            
                            </li>
                    ))}
                </ul>
            )}
    </div>
    </div>
)
}

export default GoalsForm