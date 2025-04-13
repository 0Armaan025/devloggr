import React, { useState, useRef } from 'react';
import './leaderboardpagecomponent.css';

const LeaderboardPageComponent = () => {
    const [showAll, setShowAll] = useState(false);
    const [leaderboard] = useState([
        { id: 1, name: 'CodeMaster', score: 9850, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isYou: false },
        { id: 2, name: 'DevQueen', score: 9320, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isYou: false },
        { id: 3, name: 'ByteLord', score: 9015, avatar: 'https://randomuser.me/api/portraits/men/22.jpg', isYou: false },
        { id: 4, name: 'PixelNinja', score: 8765, avatar: 'https://randomuser.me/api/portraits/women/63.jpg', isYou: false },
        { id: 5, name: 'SyntaxSamurai', score: 8540, avatar: 'https://randomuser.me/api/portraits/men/41.jpg', isYou: false },
        { id: 6, name: 'BugHunter', score: 8320, avatar: 'https://randomuser.me/api/portraits/women/28.jpg', isYou: false },
        { id: 7, name: 'ReactRanger', score: 8100, avatar: 'https://randomuser.me/api/portraits/men/19.jpg', isYou: false },
        { id: 8, name: 'You', score: 7950, avatar: 'https://randomuser.me/api/portraits/men/1.jpg', isYou: true },
        { id: 9, name: 'CSSWizard', score: 7820, avatar: 'https://randomuser.me/api/portraits/women/33.jpg', isYou: false },
        { id: 10, name: 'NodeKnight', score: 7650, avatar: 'https://randomuser.me/api/portraits/men/55.jpg', isYou: false },
    ]);

    const yourRankRef = useRef(null);
    const displayedItems = showAll ? leaderboard : leaderboard.slice(0, 5);

    const scrollToYourRank = () => {
        setShowAll(true);
        setTimeout(() => {
            yourRankRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
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
                {displayedItems.map((player, index) => (
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
                            <img src={player.avatar} alt={player.name} className="player-avatar" />
                            <span className="player-name">{player.name}</span>
                        </div>
                        <div className="player-score">
                            {player.score.toLocaleString()}
                            {player.isYou && <span className="you-indicator">YOU</span>}
                        </div>
                    </div>
                ))}
            </div>

            {!showAll && (
                <button className="view-more-btn" onClick={() => setShowAll(true)}>
                    View More
                </button>
            )}

            <button className="jump-to-rank" onClick={scrollToYourRank}>
                Jump to My Rank
                <span className="arrow-down">↓</span>
            </button>
        </div>
    );
};

export default LeaderboardPageComponent;