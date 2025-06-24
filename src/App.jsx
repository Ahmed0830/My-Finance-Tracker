import { useState } from 'react'
import ExpenseForm from './components/ExpenseForm.jsx'
import GoalsForm from './components/GoalsForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import QuickStats from './components/QuickStats.jsx'
import { Wallet } from 'lucide-react'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const handleLoginSuccess = () => {
    setLoggedIn(true);
  }
  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen'>
      <h4 className= 'pt-6 font-medium text-center text-4xl text-gray-600'><Wallet size = {40} className='inline mr-2'/>My Finance Tracker</h4>
      <h6 className='text-xl text-gray-400 text-center pb-6'>Track Spending, Save Better</h6>
    {/* <DetailsForm /> */}
    {/* <ExpenseForm /> */}
    {/* <GoalsForm /> */}
    {loggedIn ?<ExpenseForm />: <LoginForm onLoginSuccess= {handleLoginSuccess} />}
    {/* <QuickStats /> */}
    {/* <LoginForm /> */}
    </div>
  )
}

export default App
