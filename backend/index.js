const express = require("express")

const bodyParser = require("body-parser")

const cors = require("cors")


const app = express()



// middlewares


app.use(cors())

app.use(bodyParser.json())


const users = []


// helper function

const validatePayload = (payload) => {
    const { username, password, email, name, phone_number, role } = payload;
    if (!username || !password || !email || !name || !phone_number || !role) {
      return 'All fields are required';
    }
    if (!['CUSTOMER', 'RESTAURANT'].includes(role)) {
      return 'Role must be either CUSTOMER or RESTAURANT';
    }
    return null;
  };



  app.post('/v1/rest-auth/register', (req, res) => {
    const payload = req.body;
  
    // Validate payload
    const error = validatePayload(payload);
    if (error) {
      return res.status(400).json({ error });
    }

    // Check if user already exists
  const existingUser = users.find(
    (user) => user.username === payload.username || user.email === payload.email
  );
  if (existingUser) {
    return res.status(409).json({ error: 'Username or email already exists' });
  }

 // Create user object without hashing the password and without a unique ID
 const newUser = {
    username: payload.username,
    password: payload.password, // Storing plain text password (Not recommended)
    email: payload.email,
    name: payload.name,
    phone_number: payload.phone_number,
    role: payload.role,
  };

  // Save user to "database"
  users.push(newUser);

  console.log(users)

  // Respond with success
  res.status(201).json({ message: 'User registered successfully', user: { username: newUser.username, role: newUser.role } });
});




// Helper function to validate credentials
const validateCredentials = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    return user;
  }
  return null;
};

// Login endpoint
app.post('/v1/rest-auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = validateCredentials(username, password);

  if (user) {
    // Respond with success and user info (omit password in real scenarios)
    res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});





// Sample data
const orders = [
  { order_id: 1, status: 'PENDING', is_cash: true, order_version: 'v1', items: ['Item A', 'Item B'] },
  { order_id: 2, status: 'SERVED', is_cash: true, order_version: 'v2', items: ['Item C'] },
  { order_id: 3, status: 'PENDING', is_cash: false, order_version: 'v1', items: ['Item D', 'Item E'] },
  { order_id: 4, status: 'SERVED', is_cash: true, order_version: 'v3', items: ['Item F'] },
  { order_id: 5, status: 'COMPLETED', is_cash: true, order_version: 'v1', items: ['Item G'] },
  
];

// Endpoint to fetch all orders with filtering
app.get('/v1/orders/all-orders', (req, res) => {
  // Filtering orders based on the provided conditions
  const filteredOrders = orders.filter(order =>
    (order.status === 'PENDING' && order.is_cash === true) ||
    (order.status === 'SERVED' && order.is_cash === true)
  );

  // Return filtered orders
  res.status(200).json(filteredOrders);
});











app.listen(3000,()=> console.log("server running"))

