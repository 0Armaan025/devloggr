import React, { useState, useEffect } from 'react';
import './loginpage.css';
import { useNavigate } from 'react-router-dom';
import CustomFilebar from '../../components/custom-filebar/CustomFilebar';

const LoginPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Make API call to your backend login endpoint
            const response = await fetch('https://api.yourdomain.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to log in');
            }

            // Store token in localStorage
            localStorage.setItem('auth_token', data.token);

            // Mock user data since we don't have a real user name from email login
            const mockUsername = formData.email.split('@')[0];

            // Alert the username
            alert(`Successfully logged in! Welcome back, ${mockUsername}`);

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
            console.error('Login error:', error);
            // For demo purposes, we'll navigate anyway
            const mockUsername = formData.email.split('@')[0];
            alert(`Demo mode: Welcome back, ${mockUsername}`);
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubAuth = () => {
        if (typeof window.electron !== 'undefined') {
            try {
                console.log('Starting GitHub authentication...');
                // Using the simplest approach that should work with the preload script
                window.electron.send('start-github-login');
            } catch (e) {
                console.error('Error during GitHub authentication:', e);
                alert('Failed to start GitHub login: ' + e.message);
            }
        } else {
            console.log('Running in a non-Electron environment');
            alert("GitHub authentication requires the Electron environment");
        }
    };

    useEffect(() => {
        if (window.electron) {
            // Listen for authentication success
            const handleAuthSuccess = (token) => {
                console.log('Received token:', token);

                // Fetch user info with the token
                fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                })
                    .then(response => response.json())
                    .then(userData => {
                        setUserData(userData);
                        // Store token and user data
                        localStorage.setItem('auth_token', token);
                        localStorage.setItem('user_data', JSON.stringify(userData));

                        // Alert the username
                        alert(`Successfully logged in with GitHub! Welcome back, ${userData.login}`);

                        // Navigate to dashboard
                        navigate('/dashboard');
                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                    });
            };

            window.electron.on('auth-success', handleAuthSuccess);

            // Cleanup
            return () => {
                window.electron.removeAllListeners('auth-success');
            };
        }
    }, [navigate]);

    return (
        <>
            <CustomFilebar />
            <div className="login-container">
                <div className="form-side">
                    <div className="form-container">
                        <h2>Welcome back</h2>
                        <p className="subtitle">Log in to your account to continue</p>

                        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

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

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <button
                            onClick={handleGithubAuth}
                            className="google-btn"
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56 0-.28-.01-1.02-.01-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.72-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 2.89-.39c.98 0 1.97.13 2.89.39 2.2-1.49 3.18-1.18 3.18-1.18.63 1.58.24 2.75.12 3.04.75.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.69.42.37.77 1.1.77 2.22 0 1.6-.01 2.89-.01 3.28 0 .31.21.68.8.56A10.999 10.999 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                            </svg>
                            Continue with Github
                        </button>

                        <p className="signup-link">
                            Don't have an account? <a href="#" onClick={(e) => {
                                e.preventDefault();
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