import React, { useState, useEffect } from 'react';


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setNewUser({ username: user.username, password: '' });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUser.username, password: newUser.password }),
            });

            if (!response.ok) throw new Error('Error updating user: ' + response.statusText);

            setUsers(users.map(user =>
                user.id === editingUser.id
                    ? { ...user, username: newUser.username, ...(newUser.password && { password: newUser.password }) }
                    : user
            ));
            setNewUser({ username: '', password: '' });
            setEditingUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            if (!response.ok) throw new Error('Error adding user: ' + response.statusText);

            const addedUser = await response.json();
            setUsers([...users, addedUser]);
            setNewUser({ username: '', password: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Error deleting user: ' + response.statusText);

                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div>
            <h1>User Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
                <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                />
                <button type="submit">{editingUser ? 'Update User' : 'Add User'}</button>
            </form>

            <h2>User List</h2>
            <table className="userTable">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => handleEditUser(user)} style={{ marginRight: '8px' }}>Edit</button>
                                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;