import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './projectpage.css';
import CustomFilebar from '../../components/custom-filebar/CustomFilebar';

const ProjectPage = () => {
    const { name } = useParams();
    const [activeTab, setActiveTab] = useState('session');
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [totalSessions, setTotalSessions] = useState(0);
    const [sessionHistory, setSessionHistory] = useState([]);
    const [reportData, setReportData] = useState(null);
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [githubToken, setGithubToken] = useState('');

    // Mock data for demonstration
    const mockReportData = {
        filesModified: 12,
        repoUrl: 'https://github.com/user/project',
        folderUrl: '/Users/username/projects/current',
        filesEdited: ['src/App.js', 'src/components/Header.js', 'package.json'],
        linesAdded: 143,
        linesDeleted: 87,
        copyPasted: true,
        packagesUsed: ['react', 'react-dom', 'axios', 'tailwindcss'],
        techStack: ['React', 'JavaScript', 'CSS'],
        mainIdea: 'A productivity tracking application for developers',
        timeSpentTotal: '12 hours 34 minutes',
        codeChanges: [
            { time: '10:30:45', file: 'src/App.js', line: 23, change: 'Added useState hook' },
            { time: '10:32:18', file: 'src/App.js', line: 45, change: 'Modified component structure' },
            { time: '10:35:22', file: 'src/components/Header.js', line: 12, change: 'Updated styling' },
            { time: '10:40:15', file: 'package.json', line: 8, change: 'Added new dependency' },
            { time: '11:05:33', file: 'src/App.js', line: 67, change: 'Fixed bug in event handler' },
            { time: '11:20:41', file: 'src/App.js', line: 89, change: 'Optimized rendering' },
            { time: '11:45:12', file: 'src/utils/api.js', line: 5, change: 'Added API call function' },
        ]
    };

    // Timer logic
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startSession = () => {
        setIsRunning(true);
    };

    const pauseSession = () => {
        setIsRunning(false);
    };

    const endSession = () => {
        setIsRunning(false);
        const newSession = {
            date: new Date().toLocaleString(),
            duration: formatTime(timeElapsed),
            linesChanged: Math.floor(Math.random() * 50) + 10
        };
        setTotalSessions(prev => prev + 1);
        setSessionHistory(prev => [newSession, ...prev]);
        setTimeElapsed(0);
    };

    const generateReport = () => {
        setReportData(mockReportData);
        setActiveTab('report');
    };

    const generateReadme = () => {
        setShowTokenModal(true);
    };

    const pushReadme = () => {
        if (githubToken) {
            alert(`Pushing README to GitHub for ${name} with token`);
            setShowTokenModal(false);
            setGithubToken('');
        } else {
            alert('Please enter a GitHub token');
        }
    };

    return (
        <>
            <CustomFilebar />
            <div className="project-container" style={{ marginTop: "2rem" }}>
                <div className="project-header">
                    <h1>{name}</h1>
                    <div className="project-actions">
                        <button className="btn report-btn" onClick={generateReport}>
                            Generate Report
                        </button>
                        <button className="btn readme-btn" onClick={generateReadme}>
                            Generate README
                        </button>
                    </div>
                </div>

                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'session' ? 'active' : ''}`}
                        onClick={() => setActiveTab('session')}
                    >
                        Session
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
                        onClick={() => setActiveTab('report')}
                        disabled={!reportData}
                    >
                        Report
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'session' && (
                        <div className="session-controls">
                            <div className="time-display">
                                <span className="time-label">Current Session:</span>
                                <span className="time-value">{formatTime(timeElapsed)}</span>
                            </div>
                            <div className="session-buttons">
                                {!isRunning ? (
                                    <button className="btn start-btn" onClick={startSession}>
                                        Start Session
                                    </button>
                                ) : (
                                    <>
                                        <button className="btn pause-btn" onClick={pauseSession}>
                                            Pause
                                        </button>
                                        <button className="btn end-btn" onClick={endSession}>
                                            End Session
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="session-history">
                            <h3>Session History</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Duration</th>
                                        <th>Lines Changed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessionHistory.map((session, index) => (
                                        <tr key={index}>
                                            <td>{session.date}</td>
                                            <td>{session.duration}</td>
                                            <td>{session.linesChanged}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'report' && reportData && (
                        <div className="report-content">
                            <div className="report-summary">
                                <div className="report-item">
                                    <span className="report-label">Files Modified:</span>
                                    <span className="report-value">{reportData.filesModified}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Repository URL:</span>
                                    <a href={reportData.repoUrl} target="_blank" rel="noopener noreferrer">
                                        {reportData.repoUrl}
                                    </a>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Folder Path:</span>
                                    <span className="report-value">{reportData.folderUrl}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Lines Added:</span>
                                    <span className="report-value">{reportData.linesAdded}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Lines Deleted:</span>
                                    <span className="report-value">{reportData.linesDeleted}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Copy-Pasted Code:</span>
                                    <span className="report-value">
                                        {reportData.copyPasted ? '✓' : '✗'}
                                    </span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Packages Used:</span>
                                    <div className="tags">
                                        {reportData.packagesUsed.map((pkg, i) => (
                                            <span key={i} className="tag">{pkg}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Tech Stack:</span>
                                    <div className="tags">
                                        {reportData.techStack.map((tech, i) => (
                                            <span key={i} className="tag">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Main Idea:</span>
                                    <span className="report-value">{reportData.mainIdea}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Total Time Spent:</span>
                                    <span className="report-value">{reportData.timeSpentTotal}</span>
                                </div>
                            </div>

                            <div className="code-changes">
                                <h3>Code Changes Timeline</h3>
                                <div className="changes-list">
                                    {reportData.codeChanges.slice(0, 5).map((change, i) => (
                                        <div key={i} className="change-item">
                                            <span className="change-time">[{change.time}]</span>
                                            <span className="change-file">{change.file}:{change.line}</span>
                                            <span className="change-desc">{change.change}</span>
                                        </div>
                                    ))}
                                    {reportData.codeChanges.length > 5 && (
                                        <button className="view-more-btn">
                                            View More Changes ({reportData.codeChanges.length - 5})
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {showTokenModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Enter GitHub Token</h3>
                            <p>We need your GitHub token to generate and push the README</p>
                            <input
                                type="password"
                                value={githubToken}
                                onChange={(e) => setGithubToken(e.target.value)}
                                placeholder="Enter GitHub personal access token"
                            />
                            <div className="modal-actions">
                                <button className="btn cancel-btn" onClick={() => setShowTokenModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn confirm-btn" onClick={pushReadme}>
                                    Push README
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProjectPage;