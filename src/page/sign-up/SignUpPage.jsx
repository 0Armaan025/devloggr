import React, { useState, useEffect } from 'react';
import './signuppage.css';
import { useNavigate } from 'react-router-dom';
import CustomFilebar from '../../components/custom-filebar/CustomFilebar';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
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
            // Make API call to your backend signup endpoint
            const response = await fetch('https://api.yourdomain.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to sign up');
            }

            // Store token in localStorage
            localStorage.setItem('auth_token', data.token);

            // Alert the username
            alert(`Successfully signed up! Welcome, ${formData.name}`);

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
            console.error('Signup error:', error);
            // For demo purposes, we'll navigate anyway

            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = () => {
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

            // Listen for authent   ication success
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
                        alert(`Successfully signed in with GitHub! Welcome, ${userData.login}`);

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
            <div className="signup-container">
                <div className="image-side">
                    <div className="overlay">
                        <div className="brand">
                            <h1 style={{ fontFamily: "Poppins, sans-serif" }}>DevLoggr</h1>
                            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: "300" }}>Start your journey with us today.</p>
                        </div>
                    </div>
                </div>
                <div className="form-side">
                    <div className="form-container">
                        <h2 style={{ fontFamily: "Poppins, sans-serif" }}>Create an account</h2>
                        <p className="subtitle">Fill in your details to get started</p>

                        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

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
                            </div>

                            <button
                                type="submit"
                                className="signup-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <button
                            onClick={handleGoogleAuth}
                            className="google-btn"
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56 0-.28-.01-1.02-.01-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.72-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 2.89-.39c.98 0 1.97.13 2.89.39 2.2-1.49 3.18-1.18 3.18-1.18.63 1.58.24 2.75.12 3.04.75.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.69.42.37.77 1.1.77 2.22 0 1.6-.01 2.89-.01 3.28 0 .31.21.68.8.56A10.999 10.999 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                            </svg>
                            Continue with Github
                        </button>

                        <p className="login-link">
                            Already have an account? <a href="#" onClick={(e) => {
                                e.preventDefault();
                                navigate('/log-in');
                            }}>Log in</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;