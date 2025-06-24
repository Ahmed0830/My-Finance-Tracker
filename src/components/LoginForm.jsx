import React, {useState, useRef} from 'react';

const LoginForm = ({onLoginSuccess}) => {
    const [activeTab, setActiveTab] = useState('register');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        const username = nameRef.current?.value || '';
        const email = emailRef.current?.value || '';
        const password = passwordRef.current?.value || '';
        if(!username || !email || !password) {
            setError('Please fill in all fields before signing up.');
            return;
        }
        const formData = {
            username,
            email,
            password
        }
        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if(response.status === 400) {
                setError(data.error || 'Registration failed. Please try again.');
                nameRef.current.value = '';
                emailRef.current.value = '';
                passwordRef.current.value = '';
                setTimeout(() => {
                setError('');
                }, 4000);
                return;
            }
            if(response.status === 201) {
                setSuccessMessage('Registration successful! You can now log in.');
                setActiveTab('login');
                nameRef.current.value = '';
                emailRef.current.value = '';
                passwordRef.current.value = '';
            }
            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);

        } catch (err) {
            console.error(err);
            setError(err.message)
        }
        

    }
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const email = emailRef.current?.value || '';
        const password = passwordRef.current?.value || '';
        if(!email || !password) {
            setError('Please fill in all fields before loggin in.');
            return;
        }
        const formData = {
            email,
            password
        }
        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'

                    
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if(response.status === 400) {
                setError(data.error || 'Login failed. Please try again.');
                return;
            }
            const token = data.token || '';
            localStorage.setItem('token', token);
            onLoginSuccess();
            emailRef.current.value = '';
            passwordRef.current.value = '';           
        }
        catch (err) {
            console.error(err);
            setError('An error occurred while logging in. Please try again.')
        }
    }
    return (
        <div className='flex items-center w-full justify-center'>
            
            {/* Sign Up Form */}

            {activeTab === 'register' && (
            <div className='bg-white p-6 w-1/3 rounded-3xl shadow-2xl'>
            <h6 className='text-2xl text-center font-medium mb-6'>SIGN UP</h6>
            {error && (
                <div className='bg-red-100 text-red-700 p-4 rounded-md mb-4 w-full'>
                    {error}
                    </div>
            )}
            {successMessage && (
                <div className='bg-green-100 text-green-700 p-4 rounded-md mb-4 w-full'>
                    {successMessage}
                    </div>
            )}
            <form>
                <input
                type = "text"
                id = "name"
                ref = {nameRef}
                placeholder = "Name"
                className='block border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                required />

                <input
                type = "email"
                id = "email"
                ref = {emailRef}
                placeholder = "Email"
                className='block border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500' 
                required />

                <input
                type = "password"
                id = "password"
                ref = {passwordRef}
                className='block border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Password'
                required />
                <button 
                onClick = {handleRegister}
                className='w-full bg-blue-500 rounded-md mt-2 mb-2 p-2 text-white font-medium'>
                    Sign Up
                </button>
            </form>
            <p className='font-sm italic text-center mt text-medium'>Already have an account? <button className='border-none focus:outline-none text-blue-700 italic hover:underline' onClick={() => setActiveTab('login')}>Login</button></p>
            </div>
            )}
            {/* Login Form */}
            {activeTab === 'login' && (
                <div className='bg-white p-6 w-1/3 rounded-3xl shadow-2xl'>
                <h6 className='text-2xl text-center font-medium mb-6'>Log In</h6>
                {error && (
                <div className='bg-red-100 text-red-700 p-4 rounded-md mb-4 w-full'>
                    {error}
                    </div>
            )}
            {successMessage && (
                <div className='bg-green-100 text-green-700 p-4 rounded-md mb-4 w-full'>
                    {successMessage}
                    </div>
            )}
                <form>
                    
                    <input
                    type = "email"
                    id = "email"
                    ref = {emailRef}
                    placeholder = "Email"
                    className='block border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    required />
                  
                    <input
                    type = "password"
                    id = "password"
                    ref = {passwordRef}
                    className='block border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Password'
                    required />

                    <button 
                    onClick = {handleLogin}
                    className='w-full bg-blue-500 rounded-md mt-2 mb-2 p-2 text-white font-medium'>
                        Log In
                    </button>

                </form>
                <p className='font-sm italic text-center mt text-medium'>Don't have an account? <button className='border-none focus:outline-none text-blue-700 italic hover:underline' onClick={() => setActiveTab('register')}>Register here</button></p>
                </div>
            )}
        </div>
    )

}
export default LoginForm;