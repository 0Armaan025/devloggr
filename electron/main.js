import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { loginWithGitHub } from './auth.js'; // Assuming you have a separate file for GitHub login handling

// Get the current directory path using import.meta.url (for ES Module compatibility)
const isDev = true;  // Set to true if running in development mode
const __dirname = path.dirname(new URL(import.meta.url).pathname);

let mainWindow;
let authWindow;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Path to the preload.js script
            scrollBounce: true,
            nodeIntegration: false, // Disable nodeIntegration for security
            contextIsolation: true, // Isolate context for security
        },
    });

    mainWindow = win;

    win.loadURL('http://localhost:5173'); // Load your frontend (Vite app in development mode)

    // Handle window close event
    win.on('closed', () => {
        mainWindow = null;
    });
}

// Handle minimize, maximize, and close events for the main window
ipcMain.on('minimize', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

ipcMain.on('maximize', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('close', () => {
    mainWindow.close();
});

app.whenReady().then(() => {
    createWindow();

    // Recreate window on macOS if the app is activated (Cmd + Tab)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // Start GitHub OAuth login when requested by the renderer process
    ipcMain.on('start-github-login', () => {
        createAuthWindow();
    });
});

// Function to create the GitHub OAuth authentication window
function createAuthWindow() {
    // Create a new window for GitHub login
    authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        parent: mainWindow, // Make this a child of the main window
        modal: true, // Make it modal so the main window can't be interacted with while it's open
        webPreferences: {
            nodeIntegration: false, // Disable node integration for security
            contextIsolation: true, // Enable context isolation for security
        },
    });

    if (isDev) {
        // Open DevTools in development mode for debugging
        authWindow.webContents.openDevTools();
    }

    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.append('client_id', 'Ov23liUU7gvGyGV4n6f4');
    authUrl.searchParams.append('redirect_uri', 'http://localhost:5173/callback');
    authUrl.searchParams.append('scope', 'read:user user:email');

    // Load the GitHub OAuth authorization page
    authWindow.loadURL(authUrl.toString());

    // Debug: Log navigation events
    authWindow.webContents.on('will-navigate', (event, url) => {
        console.log('Auth window navigating to:', url);
    });

    // Listen for the OAuth callback URL once the user has authorized the app
    authWindow.webContents.on('did-navigate', (event, url) => {
        console.log('Auth window navigated to:', url);

        // Check if the URL includes the redirect URI with the authorization code
        if (url.startsWith('http://localhost:5173/callback') && url.includes('code=')) {
            const urlObj = new URL(url);
            const code = urlObj.searchParams.get('code');

            if (code) {
                console.log('Authorization code received:', code.substring(0, 5) + '...');

                // Once we have the authorization code, we can exchange it for an access token
                getGithubToken(code);

                // Close the auth window only after we have the code
                authWindow.close();
            }
        }
    });

    // Cleanup when the auth window is closed
    authWindow.on('closed', () => {
        console.log('Auth window closed');
        authWindow = null;
    });
}

const DEBUG = true;

// Function to exch
// 
// ange the authorization code for an access token
async function getGithubToken(code) {
    try {
        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

        const client_id = 'Ov23liUU7gvGyGV4n6f4'; // Your GitHub OAuth client ID
        const client_secret = 'c751481076ced95b29964dd9153d4ffaac45dfa4'; // Your GitHub OAuth client secret
        const redirect_uri = 'http://localhost:5173/callback'; // Your redirect URI

        if (DEBUG) console.log('Exchanging code for token:', code.substring(0, 5) + '...');

        const tokenUrl = 'https://github.com/login/oauth/access_token';
        const params = new URLSearchParams({
            client_id,
            client_secret,
            code,
            redirect_uri,
        });

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', // Set to JSON response
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json();

        if (DEBUG) console.log('Token response:', data.access_token ? 'Token received' : 'No token in response');

        if (data.access_token) {
            // Send the access token to the renderer process
            if (mainWindow) {
                console.log('Sending token to renderer process');
                mainWindow.webContents.send('auth-success', data.access_token);
                return true;
            } else {
                console.error('Main window is null, cannot send token');
                return false;
            }
        } else {
            console.error('Failed to get access token:', data);
            return false;
        }
    } catch (error) {
        console.error('Error during token exchange:', error);
        return false;
    }
}


// Handle auth success from the renderer process
ipcMain.on('auth-success', (event, token) => {
    console.log('Authorization successful! Token:', token);

    // Send the token back to the renderer process
    mainWindow.webContents.send('auth-success', token);
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
