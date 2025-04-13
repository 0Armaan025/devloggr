import React, { useState } from 'react';
import { UserIcon, FolderIcon, TrophyIcon, LogOutIcon } from 'lucide-react';
import './sidebar.css';

const SideBar = ({ onItemSelect }) => {
    const [selectedItem, setSelectedItem] = useState('Profile');



    const handleItemClick = (item) => {
        setSelectedItem(item);
        onItemSelect(item); // Pass the selected item to the parent component
    };

    return (
        <div className="sideBar">
            <div className="initial-space">
            </div>
            <h3 style={{ fontFamily: "Poppins, sans-serif", margin: "20px", fontSize: "28px" }}>DevLoggr</h3>
            <div
                className={`side-item ${selectedItem === 'Profile' ? 'active' : ''}`}
                onClick={() => handleItemClick('Profile')}
            >
                <UserIcon size={24} />
                <h3>Profile</h3>
            </div>
            <div
                className={`side-item ${selectedItem === 'Projects' ? 'active' : ''}`}
                onClick={() => handleItemClick('Projects')}
            >
                <FolderIcon size={24} />
                <h3>Projects</h3>
            </div>
            <div
                className={`side-item ${selectedItem === 'Leaderboard' ? 'active' : ''}`}
                onClick={() => handleItemClick('Leaderboard')}
            >
                <TrophyIcon size={24} />
                <h3>Leaderboard</h3>
            </div>
            <div
                className={`side-item logout ${selectedItem === 'Log Out' ? 'active' : ''}`}
                onClick={() => handleItemClick('Log Out')}
            >
                <LogOutIcon size={24} />
                <h3>Log Out</h3>
            </div>
        </div>
    );
}

export default SideBar;