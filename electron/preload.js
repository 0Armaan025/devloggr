const { contextBridge, ipcRenderer } = require('electron');

// Log when preload script runs
console.log('Preload script is running');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electron',
    {
        send: (channel, data) => {
            console.log(`Sending to channel: ${channel}`);
            // whitelist channels
            const validChannels = ['start-github-login', 'minimize', 'maximize', 'close'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        on: (channel, func) => {
            console.log(`Registering listener for channel: ${channel}`);
            const validChannels = ['auth-success', 'github-user-data'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                const subscription = (event, ...args) => func(...args);
                ipcRenderer.on(channel, subscription);
                return () => {
                    ipcRenderer.removeListener(channel, subscription);
                };
            }
        },
        removeAllListeners: (channel) => {
            console.log(`Removing all listeners for channel: ${channel}`);
            const validChannels = ['auth-success', 'github-user-data'];
            if (validChannels.includes(channel)) {
                ipcRenderer.removeAllListeners(channel);
            }
        },
        // Add convenience methods for window controls
        minimize: () => ipcRenderer.send('minimize'),
        maximize: () => ipcRenderer.send('maximize'),
        close: () => ipcRenderer.send('close')
    }
);