import React, { useState } from 'react';
import './dashboardpage.css';
import CustomFilebar from '../../components/custom-filebar/CustomFilebar';
import SideBar from '../../components/side-bar/SideBar';
import ProfileComponent from "../../components/profile-component/ProfileComponent";
import ProjectsComponent from '../../components/projects-component/ProjectsComponent';
import LeaderboardPageComponent from '../../components/leaderboard/LeaderboardPageComponent';
import SettingsComponent from '../../components/settings-component/SettingsComponent';

const DashboardPage = () => {

    const [title, setTitle] = useState("Profile");

    const handleItemSelect = (item) => {
        setTitle(item); // Update the title based on the selected item
    };

    return (
        <>
            <CustomFilebar />
            <div className="dashboardPage">
                <SideBar onItemSelect={handleItemSelect} />
                <div className="contentSide">
                    <center>
                        <div className="titleDiv">

                            <h3 className='contentSideTitle'>{title}</h3>
                        </div>

                        {title === "Profile" && (
                            <>
                                <div className="profileCompDiv">

                                    <ProfileComponent />
                                </div>
                            </>
                        )}

                        {title === "Projects" && (
                            <>
                                <ProjectsComponent />

                            </>
                        )}

                        {title === "Leaderboard" && (
                            <>
                                <LeaderboardPageComponent />

                            </>
                        )}


                        {title === "Settings" && (
                            <>
                                <SettingsComponent />

                            </>
                        )}

                    </center>
                </div>
            </div>
        </>
    );
}

export default DashboardPage