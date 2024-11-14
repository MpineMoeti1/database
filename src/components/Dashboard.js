// src/components/Dashboard.js
import React from 'react';
import ProductPieChart from './ProductPieChart';
import ImageRotator from './ImageRotator';

const Dashboard = ({ products }) => {
    const formatPrice = (price) => {
        const numericPrice = parseFloat(price);
        return isNaN(numericPrice) ? 'N/A' : numericPrice.toFixed(2);
    };

    return (
        <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #e9effd, #fdfbfb)',
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '20px auto',
        }}>
            <section style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
                <div style={{ flex: '1', textAlign: 'center', padding: '20px' }}>
                    <h3 style={{ color: '#3a7bd5', marginBottom: '20px', fontSize: '24px' }}>
                        Available Products
                    </h3>
                    {products.length === 0 ? (
                        <p style={{ color: '#888', fontSize: '18px' }}>No products have been added yet.</p>
                    ) : (
                        <div>
                            <div style={{ maxWidth: '450px', height: '450px', margin: '0 auto', marginBottom: '20px' }}>
                                <ProductPieChart products={products} />
                            </div>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                backgroundColor: '#6a0dad', /* Updated to purple */
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#3a7bd5', color: '#ffffff', textAlign: 'center' }}>
                                        <th style={{ padding: '15px' }}>Name</th>
                                        <th style={{ padding: '15px' }}>Description</th>
                                        <th style={{ padding: '15px' }}>Price</th>
                                        <th style={{ padding: '15px' }}>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={product.id} style={{
                                            backgroundColor: '#6a0dad', // Updated to purple
                                            textAlign: 'center',
                                            borderBottom: '1px solid #e0e0e0',
                                        }}>
                                            <td style={{ padding: '15px', color: '#ffffff' }}>{product.name}</td>
                                            <td style={{ padding: '15px', color: '#ffffff' }}>{product.description}</td>
                                            <td style={{ padding: '15px', color: '#ffffff' }}>${formatPrice(product.price)}</td>
                                            <td style={{ padding: '15px', color: '#ffffff' }}>{product.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div style={{
                    flex: '0.6',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    padding: '10px',
                    backgroundColor: '#fff',
                }}>
                    <ImageRotator />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;