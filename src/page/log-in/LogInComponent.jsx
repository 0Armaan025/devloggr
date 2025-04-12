import React, { useState } from 'react';
import './loginpage.css';
import { useNavigate } from 'react-router-dom';
import CustomFilebar from '../../components/custom-filebar/CustomFilebar';

const LoginPage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login form submitted:', formData);
        // Add your login logic here
    };

    const handleGoogleAuth = () => {
        // Add your Google auth logic here
        console.log('Google auth requested');
    };

    return (
        <>
            <CustomFilebar />
            <div className="login-container">
                <div className="form-side">
                    <div className="form-container">
                        <h2>Welcome back</h2>
                        <p className="subtitle">Log in to your account to continue</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                                <a href="#" className="forgot-password">Forgot password?</a>
                            </div>

                            <button type="submit" className="login-btn">Log In</button>
                        </form>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <button onClick={handleGoogleAuth} className="google-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="white" />
                            </svg>
                            Continue with Google
                        </button>

                        <p className="signup-link">
                            Don't have an account? <a href="#" onClick={() => {
                                navigate('/sign-up');
                            }}>Sign up</a>
                        </p>
                    </div>
                </div>
                <div className="image-side">
                    <div className="overlay">
                        <div className="brand">
                            <h1 style={{ fontFamily: "Poppins, sans-serif" }}>DevLoggr</h1>
                            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: "300" }}>Welcome back to your journey.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;