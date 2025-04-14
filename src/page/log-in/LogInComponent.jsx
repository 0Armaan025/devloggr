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

    // Check if user is already logged in
    useEffect(() => {
        // Check if user is already authenticated
        const token = localStorage.getItem('auth_token');
        const storedUserData = localStorage.getItem('user_data');

        if (token && storedUserData) {
            try {
                // User is already logged in, redirect to dashboard
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
                console.log('User already logged in:', parsedUserData.login || parsedUserData.name);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                // Clear invalid data
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
            }
        }
    }, [navigate]);

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

            // If user data is included in response, store it
            if (data.user) {
                localStorage.setItem('user_data', JSON.stringify(data.user));
                setUserData(data.user);
            } else {
                // Create minimal user data from email
                const mockUserData = {
                    name: formData.email.split('@')[0],
                    email: formData.email
                };
                localStorage.setItem('user_data', JSON.stringify(mockUserData));
                setUserData(mockUserData);
            }

            // Alert the username
            alert(`Successfully logged in! Welcome back, ${data.user?.name || formData.email.split('@')[0]}`);

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
                // Check which method is available and use it
                if (window.electron.send) {
                    window.electron.send('start-github-login');
                    console.log('Authentication request sent via window.electron.send');
                } else if (window.electron.ipcRenderer && window.electron.ipcRenderer.send) {
                    window.electron.ipcRenderer.send('start-github-login');
                    console.log('Authentication request sent via window.electron.ipcRenderer.send');
                } else {
                    throw new Error('No valid IPC method available');
                }
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
        if (window.electron && window.electron.on) {
            console.log('Setting up auth-success listener in LoginComponent');

            const handleAuthSuccess = (token) => {
                console.log('Auth success received with token');

                if (!token) {
                    console.error('No token received');
                    return;
                }

                // Fetch user info with the token
                fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`GitHub API responded with status ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(userData => {
                        console.log('GitHub user data received');
                        setUserData(userData);

                        // Store token and user data
                        localStorage.setItem('auth_token', token);
                        localStorage.setItem('user_data', JSON.stringify(userData));

                        // Alert the username
                        alert(`Successfully signed in with GitHub! Welcome back, ${userData.login}`);

                        // Navigate to dashboard
                        navigate('/dashboard');
                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                        alert(`Error fetching user data: ${error.message}`);
                    });
            };

            window.electron.on('auth-success', handleAuthSuccess);

            return () => {
                if (window.electron && window.electron.removeAllListeners) {
                    window.electron.removeAllListeners('auth-success');
                }
            };
        }
    }, [navigate]);

    // If already authenticated, don't render the login form
    if (userData) {
        return <div className="loading">Redirecting to dashboard...</div>;
    }

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