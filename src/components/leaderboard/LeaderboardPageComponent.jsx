import React, { useState, useRef } from 'react';
import './leaderboardpagecomponent.css';

const LeaderboardPageComponent = () => {
    const [leaderboard] = useState([
        { id: 1, name: 'CodeMaster', score: 9850, avatar: '👑', isYou: false },
        { id: 2, name: 'DevQueen', score: 9320, avatar: '⚡', isYou: false },
        { id: 3, name: 'ByteLord', score: 9015, avatar: '💻', isYou: false },
        { id: 4, name: 'PixelNinja', score: 8765, avatar: '🎮', isYou: false },
        { id: 5, name: 'SyntaxSamurai', score: 8540, avatar: '🗡️', isYou: false },
        { id: 6, name: 'BugHunter', score: 8320, avatar: '🐛', isYou: false },
        { id: 7, name: 'ReactRanger', score: 8100, avatar: '⚛️', isYou: false },
        { id: 8, name: 'You', score: 7950, avatar: '😎', isYou: true },
        { id: 9, name: 'CSSWizard', score: 7820, avatar: '🎨', isYou: false },
        { id: 10, name: 'NodeKnight', score: 7650, avatar: '🛡️', isYou: false },
    ]);

    const yourRankRef = useRef(null);

    const scrollToYourRank = () => {
        yourRankRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    };

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard-title">Leaderboard</h1>
            <p className="leaderboard-subtitle">Top performers this week</p>

            <div className="leaderboard-header">
                <span className="rank-header">Rank</span>
                <span className="player-header">Player</span>
                <span className="score-header">Score</span>
            </div>

            <div className="leaderboard-list">
                {leaderboard.map((player, index) => (
                    <div
                        key={player.id}
                        ref={player.isYou ? yourRankRef : null}
                        className={`leaderboard-item ${index < 3 ? 'top-three' : ''} ${player.isYou ? 'your-rank' : ''}`}
                    >
                        <div className="player-rank">
                            {index + 1}
                            {index < 3 && <span className="rank-medal">{['🥇', '🥈', '🥉'][index]}</span>}
                        </div>
                        <div className="player-info">
                            <span className="player-avatar">{player.avatar}</span>
                            <span className="player-name">{player.name}</span>
                        </div>
                        <div className="player-score">
                            {player.score.toLocaleString()}
                            {player.isYou && <span className="you-indicator">YOU</span>}
                        </div>
                    </div>
                ))}
            </div>

            <button className="jump-to-rank" onClick={scrollToYourRank}>
                Jump to My Rank
                <span className="arrow-down">↓</span>
            </button>
        </div>
    );
};

export default LeaderboardPageComponent;