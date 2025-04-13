import React, { useState } from 'react';
import './dashboardpage.css';
import CustomFilebar from '../../components/custom-filebar/CustomFilebar';
import SideBar from '../../components/side-bar/SideBar';
import ProfileComponent from "../../components/profile-component/ProfileComponent";

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
                                <h3>This is projects</h3>

                            </>
                        )}

                        {title === "Leaderboard" && (
                            <>
                                <h3>This is leaderboard</h3>

                            </>
                        )}

                    </center>
                </div>
            </div>
        </>
    );
}

export default DashboardPage