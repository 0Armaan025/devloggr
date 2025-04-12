import React from 'react'

const CustomFilebar = () => {

    const handleMinimize = () => {
        window.electron.minimize();
    };



    const handleMaximize = () => {
        window.electron.maximize();
    };

    const handleClose = () => {
        window.electron.close();
    };

    return (
        <>
            <div className="custom-filebar">
                <div className="app-info">
                    <span className="app-title" style={{ fontFamily: "Poppins, sans-serif" }}>DevLoggr</span>
                </div>
                <div className="filebar-controls">
                    <button onClick={handleMinimize} className="minimize-button">—</button>
                    <button onClick={handleMaximize} className="maximize-button">□</button>
                    <button onClick={handleClose} className="close-button">×</button>
                </div>
            </div>
        </>
    );
}

export default CustomFilebar