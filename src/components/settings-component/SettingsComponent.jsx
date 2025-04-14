import React, { useState } from 'react';
import './settingscomponent.css';

const SettingsComponent = () => {
    const [settings, setSettings] = useState({
        textToSpeech: false,
        quickRoast: false,
        autoTweet: false,
        speechToText: false,
        darkMode: true, // Default to dark mode
        notifications: true,
        autoSave: true
    });

    const handleToggle = (setting) => {
        setSettings({
            ...settings,
            [setting]: !settings[setting]
        });
    };

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
                    <h2>General</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Notifications</h3>
                            <p>Enable or disable notifications</p>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={() => handleToggle('notifications')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Auto Save</h3>
                            <p>Automatically save your work</p>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.autoSave}
                                onChange={() => handleToggle('autoSave')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Accessibility Features</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Text to Speech</h3>
                            <p>Convert text to spoken audio</p>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.textToSpeech}
                                onChange={() => handleToggle('textToSpeech')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

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
                </div>

                <div className="feature-spotlight">
                    <h3>Why add these new features?</h3>
                    <p>
                        "Also why shouldn't we add text to speech feature for a quick roast feature, automatic tweet feature for build in public and speech to text feature to do commands for the disabled?"
                    </p>
                    <ul className="feature-benefits">
                        <li><strong>Quick Roast:</strong> Adds a fun element to the app</li>
                        <li><strong>Automatic Tweets:</strong> Helps developers share progress easily</li>
                        <li><strong>Speech to Text Commands:</strong> Makes the app accessible to everyone</li>
                    </ul>
                </div>
            </div>

            <div className="settings-actions">
                <button className="settings-button cancel">Cancel</button>
                <button className="settings-button save">Save Changes</button>
            </div>
        </div>
    );
};

export default SettingsComponent;