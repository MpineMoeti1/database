require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

// Enable CORS for all requests
app.use(cors());
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the MySQL database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Root endpoint to check if the server is working
app.get('/', (req, res) => {
    res.send('Welcome to the backend API');
});

// User signup route
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
        if (err) return res.status(400).send('Error creating user');
        res.send({ id: results.insertId, username });
    });
});

// User login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send('Error during login');
        if (results.length === 0) return res.status(401).send('User not found');

        const user = results[0];

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        res.send({
            id: user.id,
            username: user.username,
            // Potentially send back a token if you implement JWTs
        });
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send('Error fetching users');
        }
        res.send(results);
    });
});

// Existing POST route to add user (already in place)
app.post('/api/users', async (req, res) => {
    console.log('Received POST request to add user:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).send('Error adding user');
        }
        console.log(`User added with ID: ${results.insertId}`);
        res.status(201).json({ id: results.insertId, username });
    });
});

// Update a specific user by ID
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body; // Destructure the request body
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    let updateQuery = 'UPDATE users SET username = ?' + 
        (hashedPassword ? ', password = ?' : '') + 
        ' WHERE id = ?';
    const params = hashedPassword ? [username, hashedPassword, id] : [username, id];

    db.query(updateQuery, params, (err, results) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).send('Error updating user');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.send('User updated successfully!');
    });
});

// Existing DELETE route to delete user (already in place)
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Received DELETE request for user with ID: ${id}`);
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).send('Error deleting user');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        console.log(`User with ID: ${id} deleted`);
        res.send('User deleted successfully!');
    });
});

// Get all products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Add a new product
app.post('/api/products', (req, res) => {
    const { name, description, price, quantity } = req.body;
    db.query('INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)', 
        [name, description, price, quantity], 
        (err, results) => {
            if (err) {
                console.error("Error adding product:", err);
                return res.status(500).send('Error adding product');
            }
            res.send('Product added successfully!');
    });
});

// Update an existing product
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    db.query('UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?', 
        [name, description, price, quantity, id], 
        (err, results) => {
            if (err) {
                console.error("Error updating product:", err);
                return res.status(500).send('Error updating product');
            }

            if (results.affectedRows === 0) {
                return res.status(404).send('Product not found');
            }
            // Fetch the updated product details to return to the frontend
            db.query('SELECT * FROM products WHERE id = ?', [id], (err, updatedResults) => {
                if (err) {
                    console.error("Error fetching updated product:", err);
                    return res.status(500).send('Error fetching updated product');
                }

                res.send(updatedResults[0]); // Send the updated product details
            });
        });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.send('Product deleted successfully!');
    });
});

// Sell a product (deduct a specified quantity)
app.put('/api/products/:id/sell', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body; // Quantity to deduct

    if (!quantity || isNaN(quantity) || quantity <= 0) {
        return res.status(400).send('Invalid quantity specified');
    }

    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).send('Error fetching product');
        }
        
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }

        const product = results[0];

        if (product.quantity < quantity) {
            return res.status(400).send('Not enough stock to sell the specified quantity');
        }

        db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [quantity, id], (err, results) => {
            if (err) {
                console.error("Error selling product:", err);
                return res.status(500).send('Error selling product');
            }

            // Fetch the updated product details to send back to the frontend
            db.query('SELECT * FROM products WHERE id = ?', [id], (err, updatedResults) => {
                if (err) {
                    console.error("Error fetching updated product:", err);
                    return res.status(500).send('Error fetching updated product');
                }

                res.send(updatedResults[0]); // Send back the updated product details
            });
        });
    });
});

// Start the server  
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});