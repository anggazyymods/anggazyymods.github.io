import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [scriptAccess, setScriptAccess] = useState(false);
    const [userIp, setUserIp] = useState('');

    const login = async () => {
        try {
            const response = await axios.post('/api/login', { username, password });
            if (response.data.success) {
                setIsLoggedIn(true);
                if (response.data.isAdmin) {
                    setIsAdmin(true);
                }
            } else {
                setMessage('Login failed');
            }
        } catch (error) {
            setMessage('Error during login');
        }
    };

    const register = async () => {
        try {
            const response = await axios.post('/api/register', { username: newUsername, password: newPassword });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error during registration');
        }
    };

    const requestScriptAccess = async () => {
        try {
            const response = await axios.post('/api/request-script-access');
            if (response.data.access) {
                setScriptAccess(true);
            } else {
                setMessage('Access denied');
            }
        } catch (error) {
            setMessage('Error requesting access');
        }
    };

    const handleAdminActions = async (action, targetUser) => {
        try {
            const response = await axios.post(`/api/admin/${action}`, { targetUser });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error performing admin action');
        }
    };

    const getUserIp = async () => {
        try {
            const response = await axios.get('/api/ip');
            setUserIp(response.data.ip);
        } catch (error) {
            setMessage('Error fetching IP');
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Secure Script Download</h1>
            </header>
            {!isLoggedIn ? (
                <div className="auth-container">
                    <h2>Login</h2>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={login}>Login</button>
                    <p>{message}</p>
                    <h2>Register</h2>
                    <input type="text" placeholder="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <button onClick={register}>Register</button>
                </div>
            ) : (
                <div className="user-container">
                    <h2>Welcome {username}</h2>
                    {scriptAccess ? (
                        <div className="script-content">
                            <h2>Download Script</h2>
                            <a href="https://wa.me/6288804148639" download>Download Script</a>
                        </div>
                    ) : (
                        <button onClick={requestScriptAccess}>Request Script Access</button>
                    )}
                    {isAdmin && (
                        <div className="admin-actions">
                            <h2>Admin Actions</h2>
                            <button onClick={() => handleAdminActions('approve-ip', userIp)}>Approve IP for Script Download</button>
                            <button onClick={() => handleAdminActions('list-users')}>List Users</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
