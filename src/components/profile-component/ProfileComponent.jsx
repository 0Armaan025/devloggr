import React, { useState } from 'react';
import { Award, Folder, Clock, Edit, Save, X, Code, MessageSquare } from 'lucide-react';
import './profilecomponent.css';

const ProfileComponent = () => {
    const [name, setName] = useState('John Doe');
    const [editingName, setEditingName] = useState(false);
    const [tempName, setTempName] = useState(name);

    const [profilePhoto, setProfilePhoto] = useState('https://i.pravatar.cc/150?img=68');
    const [photoLink, setPhotoLink] = useState('');
    const [editingPhoto, setEditingPhoto] = useState(false);

    const [favoriteLanguage, setFavoriteLanguage] = useState('Dart (FLUTTER)');
    const [editingFavLanguage, setEditingFavLanguage] = useState(false);
    const [tempFavLanguage, setTempFavLanguage] = useState(favoriteLanguage);

    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false);

    // Mock data
    const stats = {
        rank: 5,
        totalProjects: 12,
        totalSessions: 34,
        mostUsedLanguage: {
            name: 'TypeScript',
            percentage: 68
        }
    };

    const handleNameSubmit = () => {
        if (tempName.trim()) {
            setName(tempName);
        } else {
            setTempName(name);
        }
        setEditingName(false);
    };

    const handlePhotoSubmit = () => {
        if (photoLink.trim()) {
            setProfilePhoto(photoLink);
        }
        setEditingPhoto(false);
        setPhotoLink('');
    };

    const handleFavLanguageSubmit = () => {
        if (tempFavLanguage.trim()) {
            setFavoriteLanguage(tempFavLanguage);
        } else {
            setTempFavLanguage(favoriteLanguage);
        }
        setEditingFavLanguage(false);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        // This would connect to your authentication system
        if (forgotPassword) {
            alert('Password reset link sent to your email!');
        } else if (newPassword === confirmPassword) {
            alert('Password updated successfully!');
        } else {
            alert('Passwords do not match!');
        }

        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordReset(false);
        setForgotPassword(false);
    };

    return (
        // <div className="profileWrapper">
        <div className="profileComponent">
            <div className="profileLeftPanel">
                <div className="profilePhotoContainer">
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="profilePhoto"
                    />
                    <button
                        className="editPhotoButton"
                        onClick={() => setEditingPhoto(!editingPhoto)}
                    >
                        <Edit size={16} />
                    </button>

                    {editingPhoto && (
                        <div className="photoEditContainer">
                            <div className="inputGroup">
                                <label>Photo URL:</label>
                                <input
                                    type="text"
                                    value={photoLink}
                                    onChange={(e) => setPhotoLink(e.target.value)}
                                    placeholder="Enter image URL"
                                />
                            </div>
                            <div className="buttonGroup">
                                <button onClick={handlePhotoSubmit} className="saveButton">
                                    <Save size={16} /> Save
                                </button>
                                <button onClick={() => setEditingPhoto(false)} className="cancelButton">
                                    <X size={16} /> Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="profileNameContainer">
                    {!editingName ? (
                        <>
                            <h2 className="profileName">{name}</h2>
                            <button
                                className="editButton"
                                onClick={() => {
                                    setTempName(name);
                                    setEditingName(true);
                                }}
                            >
                                <Edit size={16} />
                            </button>
                        </>
                    ) : (
                        <div className="editContainer">
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="editInput"
                            />
                            <div className="buttonGroup">
                                <button onClick={handleNameSubmit} className="saveButton">
                                    <Save size={16} /> Save
                                </button>
                                <button
                                    onClick={() => setEditingName(false)}
                                    className="cancelButton"
                                >
                                    <X size={16} /> Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="languagePreference">
                    <div className="favoriteLanguageContainer">
                        {!editingFavLanguage ? (
                            <>
                                <div className="languageLabel">
                                    <Code size={18} />
                                    <span>Favorite Language</span>
                                </div>
                                <div className="languageValue" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {favoriteLanguage}
                                    <button
                                        className="editButton"
                                        onClick={() => {
                                            setTempFavLanguage(favoriteLanguage);
                                            setEditingFavLanguage(true);
                                        }}
                                    >
                                        <Edit size={16} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="editContainer">
                                <div className="languageLabel">
                                    <Code size={18} />
                                    <span>Favorite Language</span>
                                </div>
                                <input
                                    type="text"
                                    value={tempFavLanguage}
                                    onChange={(e) => setTempFavLanguage(e.target.value)}
                                    className="editInput"
                                />
                                <div className="buttonGroup">
                                    <button onClick={handleFavLanguageSubmit} className="saveButton">
                                        <Save size={16} /> Save
                                    </button>
                                    <button
                                        onClick={() => setEditingFavLanguage(false)}
                                        className="cancelButton"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mostUsedLanguageContainer">
                        <div className="languageLabel">
                            <MessageSquare size={18} />
                            <span>Most Used Language</span>
                        </div>
                        <div className="mostUsedLanguage">
                            <span>{stats.mostUsedLanguage.name}</span>
                            <div className="languageBar">
                                <div
                                    className="languageProgress"
                                    style={{ width: `${stats.mostUsedLanguage.percentage}%` }}
                                ></div>
                            </div>
                            <span className="languagePercentage">{stats.mostUsedLanguage.percentage}%</span>
                        </div>
                    </div>
                </div>

                <div className="securitySection">
                    <button
                        className="passwordResetButton"
                        onClick={() => setShowPasswordReset(!showPasswordReset)}
                    >
                        Reset Password
                    </button>
                </div>
            </div>

            <div className="profileRightPanel">
                <div className="statsPanel">
                    <h3 className="panelTitle">Your Stats</h3>

                    <div className="statItem">
                        <div className="statIcon">
                            <Award size={22} />
                        </div>
                        <div className="statInfo">
                            <h4>Rank</h4>
                            <p>#{stats.rank} <span className="statSubtext">in Leaderboard</span></p>
                        </div>
                    </div>

                    <div className="statItem">
                        <div className="statIcon">
                            <Folder size={22} />
                        </div>
                        <div className="statInfo">
                            <h4>Projects</h4>
                            <p>{stats.totalProjects} <span className="statSubtext">Total</span></p>
                        </div>
                    </div>

                    <div className="statItem">
                        <div className="statIcon">
                            <Clock size={22} />
                        </div>
                        <div className="statInfo">
                            <h4>Sessions</h4>
                            <p>{stats.totalSessions} <span className="statSubtext">Completed</span></p>
                        </div>
                    </div>
                </div>

                {showPasswordReset && (
                    <div className="passwordResetPanel">
                        <h3 className="panelTitle">Reset Password</h3>
                        <form onSubmit={handlePasswordReset}>
                            {!forgotPassword ? (
                                <>
                                    <div className="inputGroup">
                                        <label>Current Password:</label>
                                        <input
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label>New Password:</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label>Confirm Password:</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="forgotPasswordLink">
                                        <a href="#" onClick={(e) => {
                                            e.preventDefault();
                                            setForgotPassword(true);
                                        }}>Forgot password?</a>
                                    </div>
                                </>
                            ) : (
                                <div className="forgotPasswordForm">
                                    <p>We'll send a password reset link to your email address.</p>
                                    <div className="inputGroup">
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div className="forgotPasswordLink">
                                        <a href="#" onClick={(e) => {
                                            e.preventDefault();
                                            setForgotPassword(false);
                                        }}>Back to password reset</a>
                                    </div>
                                </div>
                            )}

                            <div className="buttonGroup">
                                <button type="submit" className="saveButton">
                                    {forgotPassword ? 'Send Reset Link' : 'Update Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordReset(false);
                                        setForgotPassword(false);
                                    }}
                                    className="cancelButton"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>

    );
};

export default ProfileComponent;