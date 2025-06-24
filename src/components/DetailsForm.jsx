import React, {useState, useRef} from 'react';

const DetailsForm = () => {
    const [income, setIncome] = useState('');
    const [plannedSavings, setPlannedSavings] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [currentSelection, setCurrentSelection] = useState('');

    const incomeRef = useRef();
    const customSavingRef = useRef();

    const handleSavingSelection = (value) => {
        setCurrentSelection(value);
        if (value === 'Custom') {
            setShowCustomInput(true);
        } else {
            setShowCustomInput(false);
        }
    }
    const handleSave = () => {
        const incomeValue = incomeRef.current?.value || '';
        const customValue = customSavingRef.current?.value || '';

        setIncome(incomeValue);
        if (currentSelection === 'Custom') {
            setPlannedSavings(customValue + '%');
        } else {
            setPlannedSavings(currentSelection);
        }
    }
    return (
        <div className="p-6 max-w-md mx-auto">
        <h3 className="text-blue-500 text-xl font-bold mb-6">Enter Your Salary and Expected Savings</h3>
    <div>
      <form>
        {/* salary input and planned savings percentage is entered in this form */}
        <div className="mb-6">
        <label className= "block text-gray-700 font-medium mb-2" htmlFor ="salaryInput">Your Income ($):</label>
        <input
        ref = {incomeRef} 
        className="w-full m-0 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
        type = "number"
        id="salaryInput"
        placeholder="1000"
        onKeyDown={(e) => {
            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
              e.preventDefault();
            }
          }}
        />
        </div>
        <div className="mb-4">
        <label className= "block text-gray-700 font-medium mb-3">Planned Savings (%):</label>
        <button 
        type="button" 
        className= {`p-4 mr-2 border rounded-md ${currentSelection === '15%' ? 'bg-blue-500 text-white' : 'border-gray-300'}`}
        onClick ={() => handleSavingSelection('15%')} >
            15%
        </button>
        <button 
        type="button" 
        className= {`p-4 mr-2 border rounded-md ${currentSelection === '20%' ? 'bg-blue-500 text-white' : 'border-gray-300'}`}
        onClick ={() => handleSavingSelection('20%')} >
            20%
        </button>
        <button 
        type="button" 
        className= {`p-4 mr-2 border rounded-md ${currentSelection === '25%' ? 'bg-blue-500 text-white' : 'border-gray-300'}`}
        onClick ={() => handleSavingSelection('25%')}>
            25%
        </button>
        <button 
        type="button" 
        className= {`p-4 mr-2 border rounded-md ${currentSelection === 'Custom' ? 'bg-blue-500 text-white' : 'border-gray-300'}`}
        onClick ={() => handleSavingSelection('Custom')}>
            Custom
        </button>
        </div>
        {/* Custom savings input */}
        {showCustomInput && (
            <div className="mb-4">
            <label htmlFor= 'customSavingsInput' className='block text-gray-700 font-medium mb-2'>Enter Custom Savings Percentage:</label>
            <input 
            ref={customSavingRef}
            type='number' 
            className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
            placeholder='Enter percentage (e.g., 30)'
            onKeyDown={(e) => {
                if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
            />
        </div>
        )}
        <button
        type = "button"
        onClick = {handleSave}
        className="w-full mt-4 bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600 transition duration-200">
            Save
        </button>

      </form>
      {/* testing values by displaying */}
      {/* <div>{income}</div>
      <div>{plannedSavings}</div> */}

    </div>
        </div>
    )
}

export default DetailsForm