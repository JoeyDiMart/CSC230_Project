import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forgotPasswordPage.css';
import API_BASE_URL from "../config.js";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError('');
                // Clear form after successful submission
                setEmail('');
            } else {
                setError(data.error || 'Failed to send password reset email. Please try again.');
                setMessage('');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred. Please try again.');
            setMessage('');
        }
    };

    return (
        <div className="LoginPage">
            <div className="LoginWrapper">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="input-field">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    {message && (
                        <div className="success-message">{message}</div>
                    )}
                    
                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <div className="submit-button">
                        <button type="submit">Send Reset Link</button>
                    </div>
                </form>
                <div className="back-link">
                    <button onClick={() => navigate('/login')}>
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
