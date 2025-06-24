import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import { MongoClient, ObjectId} from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import authMiddleware from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // Load .env file explicitly
dotenv.config(path.join(__dirname, '../.env'));

const corsOptions = {
    origin: 'http://localhost:5173' 
  };
const app = express();
let db;
app.use(cors(corsOptions));
app.use(express.json());

// Database connection
async function databaseConnection() {
    try {   
        // eslint-disable-next-line no-undef
        const client = new MongoClient(process.env.VITE_DB_URI);
        await client.connect();
        db = await client.db('personal_finance_tracker')
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        
        });
    } catch (err) {
        console.error ('Error conneciting to MongoDB:', err);
    }
}

databaseConnection();
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
    
}

const verifyPassword = async (password, storedHash) => {
    return await bcrypt.compare(password, storedHash);

}

// Register new users
app.post('/api/users/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({error: 'Username, email, and password are required.'});
        }
        const loginCollection = db.collection('loginData');
        const user = await loginCollection.findOne({email})
        if(user) {
            return res.status(400).json({error: 'Email already exists.'});
        }
        
        const hashedPassword = await hashPassword(password);
        await loginCollection.insertOne({username, email, hashedPassword, createdAt: new Date()});
        res.status(201).json({ message: 'User created successfully.'});
    } catch (err){
        console.error('Error creating user:', err);
        res.status(500).json({message: 'Error creating user'});
    }
});

// Login existing users
app.post('/api/users/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required.'});
        }
        const loginCollection = db.collection('loginData');
        const user = await loginCollection.findOne({email});
        if(!user) {
            return res.status(400).json({error: 'Invalid email.'});
        }
        const isPasswordValid = await verifyPassword(password, user.hashedPassword);
        if(!isPasswordValid) {
            return res.status(400).json({error: 'Invalid password.'});
        }
        // Generate JWT token
        const payload = {
            user: {
                id: user._id // unique id from mongodb
            }
        };
        jwt.sign(
            payload,
            // eslint-disable-next-line no-undef
            process.env.VITE_JWT_SECRET,
            {expiresIn: '1h'},
            (err, token) => {
                if (err) throw err;

                res.status(200).json({ token }); // send token to client
            }
        )
        // res.status(200).json({message: 'Login successful', user: {username: user.username, email: user.email}});

    } catch(err) {
        console.error('Error loggin in: ', err);
        res.status(500).json({message: 'Error logging in'});
    }
})

// store expenses in database

app.post('/api/expenses', authMiddleware, async (req, res) => {
    try {
        const user_id = new ObjectId(req.user.id); // get user id from token
        const {amount, category, date} = req.body;
        if (!amount || !category) {
            return res.status(400).json({error: 'Both amount and category are required.'})
        }
        const expensesCollection = db.collection('expenses');
        const expense = {
            _id: new ObjectId(),
            amount: parseFloat(amount),
            category,
            date: date ? new Date(date) : new Date(),
        }
            await expensesCollection.updateOne({user_id: user_id}, {$push: {expenses: expense}}, {upsert: true});
        
        
        res.status(201).json({message: 'Expense added successfully.', expense});
    }
    catch (err) {
        console.error('Error adding expense:', err);
        res.status(500).json({message: 'Error adding expense'});
    }
})

// Get all expenses for a user

app.get('/api/expenses', authMiddleware, async(req, res) => {
    try {
        const user_id = new ObjectId(req.user.id);
        const expensesCollection = db.collection('expenses');
        const userExpenses = await expensesCollection.findOne({user_id: user_id});
        if (!userExpenses) {
            return res.status(404).json({error: 'No expenses found for this user.'});
        }
        res.status(200).json(userExpenses.expenses || []);
        
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({message: 'Error fetching expenses'});
    }

})

// store goals in db

app.post('/api/goals', authMiddleware, async (req, res) => {
    try {
        const user_id = new ObjectId(req.user.id);
        const {current, target, goal, date} = req.body;
        if (!current || !target || !goal) {
            return res.status(400).json({error: 'Current value, target value, and goal are required'});
        }
        const goalsCollection = db.collection('goals');
        const newGoal = {
            _id: new ObjectId(),
            user_id: user_id,
            current: parseFloat(current),
            target: parseFloat(target),
            goal,
            date
        }
        await goalsCollection.updateOne({user_id: user_id}, {$push: {goals: newGoal}}, {upsert: true});
        res.status(201).json({message: 'Goal added successfully.', newGoal});
    } catch(err) {
        console.error('Error adding goal:', err);
        res.status(500).json({message: 'Error adding goal'});
    }
})

// fetching goals of a user

app.get('/api/goals', authMiddleware, async (req, res) => {
    try {
        const user_id = new ObjectId(req.user.id);
        const goalsCollection = db.collection('goals');
        const userGoals = await goalsCollection.findOne({user_id: user_id});
        if (!userGoals) {
            return res.status(404).json({error: 'No goals found for this user.'});
        }
        res.status(200).json(userGoals.goals || []);
    } catch (err) {
        console.error('Error fetching goals:', err);
        res.status(500).json({message: 'Error fetching goals'});
    }
})

// delete goals

app.delete('/api/goals/:id', authMiddleware, async (req, res) => {
    try {
        const user_id = new ObjectId(req.user.id);
        const goalId = new ObjectId(req.params.id);
        const goalsCollection = db.collection('goals');
        const result = await goalsCollection.updateOne(
            {user_id: user_id},
            {$pull: {goals: {_id: goalId}}},
            {upsert: false}
        )
        if (result.modifiedCount === 0) {
            return res.status(404).json({error: 'Goal not found.'});
        }
        res.status(200).json({message: 'Goal deleted successfully.'});
    } catch (err) {
        console.error('Error deleting goal:', err);
        res.status(500).json({message: 'Error deleting goal'});
    }
})

// Update goals
app.patch('/api/goals/:id', authMiddleware, async (req, res) => {
    try {
        const user_id = new ObjectId(req.user.id);
        const goalId = new ObjectId(req.params.id);
        const {current} = req.body;
        if (!current) {
            return res.status(400).json({error: 'Current value is required.'});
        }
        const goalsCollection = db.collection('goals');
        await goalsCollection.updateOne(
            {
                user_id: user_id,
                'goals._id': goalId
            },
            {
                $set: {
                    'goals.$.current': parseFloat(current),
                }
            }
        );
        res.status(200).json({message: 'Goal updated successfully.'});
    } catch (err) {
        console.error('Error updating goal:', err);
        res.status(500).json({message: 'Error updating goal'});
    }
})

/*
TO-DO
1. Implement quick stats dashboard
2. Income tax calculator
*/