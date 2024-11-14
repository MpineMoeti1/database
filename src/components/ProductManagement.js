import React, { useEffect, useState } from 'react';

const ProductManager = ({ onProductsUpdate }) => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: ''
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]); // Local products state

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) throw new Error('Error adding product');
            const addedProduct = await response.json();

            setProducts(prevProducts => [...prevProducts, addedProduct]);
            onProductsUpdate(prevProducts => [...prevProducts, addedProduct]);
            setNewProduct({ name: '', description: '', price: '', quantity: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) throw new Error('Error updating product');
            const updatedProduct = await response.json();

            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );
            onProductsUpdate(prevProducts => 
                prevProducts.map(product => 
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );

            setNewProduct({ name: '', description: '', price: '', quantity: '' });
            setEditingProduct(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Error deleting product');

                setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
                onProductsUpdate(prevProducts => prevProducts.filter(product => product.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleEditProduct = (product) => {
        setNewProduct(product);
        setEditingProduct(product);
    };

    const handleSellProduct = async (productId) => {
        const product = products.find(p => p.id === productId);
        const quantityToSell = prompt(`Enter the quantity to sell (Max: ${product.quantity}):`);

        if (quantityToSell !== null) {
            const quantity = parseInt(quantityToSell, 10);
            if (isNaN(quantity) || quantity <= 0 || quantity > product.quantity) {
                alert('Invalid quantity specified. Please enter a number between 1 and the available quantity.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/products/${productId}/sell`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity }),
                });
                
                if (!response.ok) throw new Error('Error selling product');
                
                const updatedProduct = await response.json();

                setProducts(prevProducts => 
                    prevProducts.map(p => (p.id === productId ? updatedProduct : p))
                );
                onProductsUpdate(prevProducts => 
                    prevProducts.map(p => (p.id === productId ? updatedProduct : p))
                );

            } catch (err) {
                console.error(err.message);
                setError(err.message);
            }
        }
    };

    return (
        <div>
            <h1>Product Manager</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newProduct.quantity}
                    onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    required
                />
                <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
            </form>

            <h2>Existing Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button onClick={() => handleEditProduct(product)}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                <button onClick={() => handleSellProduct(product.id)}>Sell</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManager;
