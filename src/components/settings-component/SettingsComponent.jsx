import React, { useState, useEffect } from 'react';
import './settingscomponent.css';
import { Twitter, X, Clock } from 'lucide-react';

const SettingsComponent = () => {
    const [settings, setSettings] = useState({
        quickRoast: false,
        autoTweet: false,
        speechToText: false,
        darkMode: true, // Default to dark mode
        tweetTime: '09:00' // Default tweet time
    });

    const [showTwitterModal, setShowTwitterModal] = useState(false);
    const [twitterUsername, setTwitterUsername] = useState('');
    const [isTwitterConnected, setIsTwitterConnected] = useState(false);
    const [twitterAuthLoading, setTwitterAuthLoading] = useState(false);

    // Check if Twitter is already connected
    useEffect(() => {
        const twitterData = localStorage.getItem('twitter_data');
        if (twitterData) {
            try {
                const parsedData = JSON.parse(twitterData);
                setTwitterUsername(parsedData.username || '');
                setIsTwitterConnected(true);

                // If Twitter was previously connected, make sure autoTweet is enabled
                if (!settings.autoTweet) {
                    setSettings(prev => ({ ...prev, autoTweet: true }));
                }
            } catch (error) {
                console.error('Error parsing Twitter data:', error);
                localStorage.removeItem('twitter_data');
            }
        }

        // Load saved tweet time if it exists
        const savedTweetTime = localStorage.getItem('tweet_time');
        if (savedTweetTime) {
            setSettings(prev => ({ ...prev, tweetTime: savedTweetTime }));
        }
    }, []);

    const handleToggle = (setting) => {
        if (setting === 'autoTweet' && !isTwitterConnected && !settings.autoTweet) {
            // Show Twitter auth modal when enabling autoTweet without connection
            setShowTwitterModal(true);
            return;
        }

        setSettings({
            ...settings,
            [setting]: !settings[setting]
        });

        // If user disables autoTweet, we don't disconnect Twitter,
        // but we stop automatic tweets
    };

    const handleTweetTimeChange = (e) => {
        const newTime = e.target.value;
        setSettings({
            ...settings,
            tweetTime: newTime
        });

        // Save the time setting to localStorage
        localStorage.setItem('tweet_time', newTime);
    };

    const connectTwitter = () => {
        setTwitterAuthLoading(true);

        // Call the Electron function to start Twitter authentication
        if (typeof window.electron !== 'undefined') {
            try {
                console.log('Starting Twitter authentication...');
                window.electron.send('start-twitter-login');

                // The result will be handled by the event listener below
            } catch (e) {
                console.error('Error during Twitter authentication:', e);
                alert('Failed to start Twitter login: ' + e.message);
                setTwitterAuthLoading(false);
                setShowTwitterModal(false);
            }
        } else {
            console.log('Running in a non-Electron environment');
            alert("Twitter authentication requires the Electron environment");
            setTwitterAuthLoading(false);
            setShowTwitterModal(false);
        }
    };

    const disconnectTwitter = () => {
        // Disconnect Twitter (just remove local data)
        localStorage.removeItem('twitter_data');
        localStorage.removeItem('twitter_token');
        setIsTwitterConnected(false);
        setTwitterUsername('');

        // Turn off auto tweet feature
        setSettings(prev => ({ ...prev, autoTweet: false }));
    };

    // Save settings to localStorage
    const saveSettings = () => {
        localStorage.setItem('app_settings', JSON.stringify(settings));
        // Show a success message or notification
        alert('Settings saved successfully!');
    };

    // Listen for Twitter auth success event from Electron
    useEffect(() => {
        if (window.electron && window.electron.on) {
            const handleTwitterAuthSuccess = (data) => {
                console.log('Twitter auth successful:', data);

                // Save Twitter data
                if (data?.username) {
                    setTwitterUsername(data.username);
                    setIsTwitterConnected(true);

                    // Store Twitter data
                    localStorage.setItem('twitter_data', JSON.stringify({
                        username: data.username,
                        userId: data.userId
                    }));

                    if (data.token) {
                        localStorage.setItem('twitter_token', data.token);
                    }

                    // Enable auto tweet feature
                    setSettings(prev => ({ ...prev, autoTweet: true }));
                }

                setTwitterAuthLoading(false);
                setShowTwitterModal(false);
            };

            window.electron.on('twitter-auth-success', handleTwitterAuthSuccess);

            return () => {
                if (window.electron.removeAllListeners) {
                    window.electron.removeAllListeners('twitter-auth-success');
                }
            };
        }
    }, []);

    useEffect(() => {
        if (window.electron && window.electron.on) {
            // Listen for Twitter auth errors
            const handleTwitterAuthError = (errorMessage) => {
                console.error('Twitter auth error:', errorMessage);
                setTwitterAuthLoading(false);
                setShowTwitterModal(false);

                // Show error message to user
                alert(`Twitter authentication failed: ${errorMessage}`);
            };

            window.electron.on('twitter-auth-error', handleTwitterAuthError);

            return () => {
                if (window.electron && window.electron.removeAllListeners) {
                    window.electron.removeAllListeners('twitter-auth-error');
                }
            };
        }
    }, []);

    return (
        <div className="settings-container">
            <div className="settings-content">
                <div className="settings-section">
                    <h2>Appearance</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Dark Mode</h3>
                            <p>Switch between dark and light theme</p>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.darkMode}
                                onChange={() => handleToggle('darkMode')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Accessibility Features</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Quick Roast Feature</h3>
                            <p>Enable voice-based roasts at the click of a button</p>
                            <div className="feature-callout">
                                <span className="feature-badge">NEW</span>
                                <span className="feature-note">Adds humor with spoken roasts</span>
                            </div>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.quickRoast}
                                onChange={() => handleToggle('quickRoast')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Speech to Text</h3>
                            <p>Control the app using voice commands for improved accessibility</p>
                            <div className="feature-callout">
                                <span className="feature-badge accessibility">ACCESSIBILITY</span>
                                <span className="feature-note">Helpful for users with disabilities</span>
                            </div>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.speechToText}
                                onChange={() => handleToggle('speechToText')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Social Integration</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Automatic Tweet Feature</h3>
                            <p>Share your progress automatically on Twitter/X</p>
                            {isTwitterConnected && (
                                <div className="connected-account">
                                    <span className="connected-badge">
                                        <Twitter size={14} /> Connected
                                    </span>
                                    <span className="username">@{twitterUsername}</span>
                                    <button
                                        className="disconnect-btn"
                                        onClick={disconnectTwitter}
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            )}
                            <div className="feature-callout">
                                <span className="feature-badge">BUILD IN PUBLIC</span>
                                <span className="feature-note">Perfect for showcasing your work</span>
                            </div>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.autoTweet}
                                onChange={() => handleToggle('autoTweet')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {/* New Tweet Time Picker Setting */}
                    {settings.autoTweet && (
                        <div className="setting-item tweet-time-setting">
                            <div className="setting-info">
                                <h3>Daily Tweet Time</h3>
                                <p>Set when your daily progress tweets will be sent</p>
                                <div className="time-selector">
                                    <Clock size={18} className="time-icon" />
                                    <input
                                        type="time"
                                        value={settings.tweetTime}
                                        onChange={handleTweetTimeChange}
                                        className="time-input"
                                    />
                                </div>
                                <div className="feature-callout">
                                    <span className="feature-badge">SCHEDULED</span>
                                    <span className="feature-note">Best results at high-engagement times</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="feature-spotlight">
                    <h3>Why add these new features?</h3>
                    <p>
                        "Also why shouldn't we add text to speech feature for a quick roast feature, automatic tweet feature for build in public and speech to text feature to do commands for the disabled?"
                    </p>
                    <ul className="feature-benefits">
                        <li><strong>Quick Roast:</strong> Adds a fun element to the app</li>
                        <li><strong>Automatic Tweets:</strong> Helps developers share progress easily</li>
                        <li><strong>Tweet Scheduling:</strong> Optimize your social media presence</li>
                        <li><strong>Speech to Text Commands:</strong> Makes the app accessible to everyone</li>
                    </ul>
                </div>
            </div>

            <div className="settings-actions">
                <button className="settings-button cancel">Cancel</button>
                <button className="settings-button save" onClick={saveSettings}>Save Changes</button>
            </div>

            {/* Twitter Auth Modal */}
            {showTwitterModal && (
                <div className="modal-overlay">
                    <div className="modal-content twitter-auth-modal">
                        <div className="modal-header">
                            <h3>Connect to Twitter</h3>
                            <button
                                className="close-modal-btn"
                                onClick={() => setShowTwitterModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="twitter-icon">
                                <Twitter size={48} color="#1DA1F2" />
                            </div>
                            <p>To enable automatic tweets about your dev progress, connect your Twitter account.</p>
                            <p className="permission-note">
                                DevLoggr will only post tweets when you complete significant milestones in your projects.
                                You can disable this at any time.
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowTwitterModal(false)}
                                disabled={twitterAuthLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="twitter-connect-btn"
                                onClick={connectTwitter}
                                disabled={twitterAuthLoading}
                            >
                                {twitterAuthLoading ? 'Connecting...' : 'Connect Twitter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsComponent;