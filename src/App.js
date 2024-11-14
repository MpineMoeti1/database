// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import SignupAndLogin from './components/SignupAndLogin';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement'; 
import UserManagement from './components/UserManagement';
import { FaSignOutAlt, FaHome, FaCogs, FaUser } from 'react-icons/fa';
import './Style.css';

function App() {
    const [products, setProducts] = useState([]); // Lifted product state
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            setIsAuthenticated(true); // Automatically authenticate if token exists
        }

        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProducts(data); // Set initial products from API
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchProducts();
    }, []);

    return (
        <Router>
            <AppContent 
                products={products} 
                setProducts={setProducts} 
                isAuthenticated={isAuthenticated} 
                setIsAuthenticated={setIsAuthenticated} 
            />
        </Router>
    );
}

function AppContent({ products, setProducts, isAuthenticated, setIsAuthenticated }) {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    // Set a purple background color for the app
    const style = {
        backgroundColor: '#800080',
        minHeight: '100vh',
        color: 'white',
        paddingTop: '70px', // Padding to ensure content doesn't overlap navbar
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsAuthenticated(false);
    };

    return (
        <div className="app-container" style={style}>
            {/* Conditionally render the navigation bar based on route */}
            {!isAuthPage && (
                <header className="navbar" style={navbarStyle}>
                    <Link to="/dashboard" className="nav-link">
                        <FaHome className="nav-icon" />
                        Dashboard
                    </Link>
                    <Link to="/products" className="nav-link">
                        <FaCogs className="nav-icon" />
                        Product Management
                    </Link>
                    <Link to="/users" className="nav-link">
                        <FaUser className="nav-icon" />
                        User Management
                    </Link>
                    <Link to="/login" onClick={handleLogout} className="nav-link">
                        <FaSignOutAlt className="nav-icon" />
                        Logout
                    </Link>
                </header>
            )}

            {/* Define routes including dashboard and product management */}
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<SignupAndLogin setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/login" element={<SignupAndLogin setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard products={products} /> : <Navigate to="/login" />} />
                <Route path="/products" element={isAuthenticated ? <ProductManagement setProducts={setProducts} /> : <Navigate to="/login" />} />
                <Route path="/users" element={isAuthenticated ? <UserManagement /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

// Style for the navbar
const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor:  '#6a0dad',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000, // Ensure the navbar is above the content
};

export default App;