import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { loginWithGitHub } from './auth.js'; // Assuming you have a separate file for GitHub login handling
import { randomBytes, createHash } from 'crypto';


// Get the current directory path using import.meta.url (for ES Module compatibility)
const isDev = true;  // Set to true if running in development mode
const __dirname = path.dirname(new URL(import.meta.url).pathname);

let mainWindow;
let authWindow;
let twitterCodeVerifier = '';

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

ipcMain.on('start-twitter-login', () => {
    console.log('Twitter login requested');
    createTwitterAuthWindow();
});

// Function to create the Twitter OAuth authentication window
function createTwitterAuthWindow() {
    // Generate a code verifier (required for PKCE)
    twitterCodeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(twitterCodeVerifier); // Use SHA256 method

    console.log('Generated code verifier:', twitterCodeVerifier.substring(0, 5) + '...');

    // Twitter OAuth parameters
    const twitterClientId = 'YOUR_TWITTER_CLIENT_ID'; // Replace with your actual Client ID
    const redirectUri = 'http://127.0.0.1:5173/twitter-callback';

    // Create the auth URL properly
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', twitterClientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', 'tweet.read tweet.write users.read');
    authUrl.searchParams.append('state', randomBytes(16).toString('hex'));
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256'); // Use SHA256 method, not plain

    console.log('Auth URL created:', authUrl.toString());

    // Create window for Twitter auth
    const twitterAuthWindow = new BrowserWindow({
        width: 800,
        height: 800,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // Load the Twitter auth URL
    twitterAuthWindow.loadURL(authUrl.toString());

    // Enhanced debugging
    twitterAuthWindow.webContents.on('will-navigate', (event, url) => {
        console.log('Twitter auth window navigating to:', url);
    });

    // Handle redirects for Twitter callback
    twitterAuthWindow.webContents.on('did-navigate', (event, url) => {
        console.log('Twitter auth window navigated to:', url);

        // Check if the URL is the callback URL with authorization code
        if (url.startsWith(redirectUri)) {
            try {
                const urlObj = new URL(url);
                const code = urlObj.searchParams.get('code');
                const error = urlObj.searchParams.get('error');

                if (error) {
                    console.error('Twitter auth error:', error);
                    const errorDescription = urlObj.searchParams.get('error_description');

                    // Send error to renderer
                    if (mainWindow) {
                        mainWindow.webContents.send('twitter-auth-error',
                            errorDescription || 'Authorization was denied');
                    }
                    twitterAuthWindow.close();
                    return;
                }

                if (code) {
                    console.log('Twitter authorization code received');

                    // Exchange code for token using the same code_verifier
                    getTwitterToken(code, redirectUri, twitterCodeVerifier)
                        .then(() => {
                            twitterAuthWindow.close();
                        })
                        .catch(error => {
                            console.error('Error getting Twitter token:', error);
                            if (mainWindow) {
                                mainWindow.webContents.send('twitter-auth-error',
                                    error.message || 'Failed to exchange code for token');
                            }
                            twitterAuthWindow.close();
                        });
                }
            } catch (error) {
                console.error('Error handling Twitter callback:', error);
                if (mainWindow) {
                    mainWindow.webContents.send('twitter-auth-error',
                        'Error processing authentication response');
                }
                twitterAuthWindow.close();
            }
        }
    });
}

// Generate a code verifier for PKCE
function generateCodeVerifier() {
    return randomBytes(32)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
        .substring(0, 43); // Standard length for PKCE
}

// Add a function to generate a proper code challenge
function generateCodeChallenge(verifier) {
    return createHash('sha256')
        .update(verifier)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Exchange authorization code for token
async function getTwitterToken(code, redirectUri, codeVerifier) {
    try {
        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

        const twitterClientId = 'YOUR_TWITTER_CLIENT_ID'; // Same as above
        // Twitter no longer requires client_secret for PKCE flow

        console.log('Exchanging code for token...');
        console.log('Using code verifier:', codeVerifier.substring(0, 5) + '...');

        // Create proper form data for token request
        const params = new URLSearchParams();
        params.append('client_id', twitterClientId);
        // Do not include client_secret for PKCE flow
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirectUri);
        params.append('code_verifier', codeVerifier);

        console.log('Sending token request params:', params.toString());

        const response = await fetch('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });

        // Log response for debugging
        const responseText = await response.text();
        console.log(`Token response status: ${response.status}`);
        console.log(`Token response body (first 100 chars): ${responseText.substring(0, 100)}`);

        // Parse response as JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse token response as JSON:', responseText);
            throw new Error('Invalid response from Twitter');
        }

        if (data.access_token) {
            // Rest of function remains the same...
        } else {
            const errorMsg = data.error_description || data.error || 'Failed to obtain access token';
            console.error('Token error:', errorMsg, data);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Error during Twitter token exchange:', error);
        throw error;
    }
}

const DEBUG = true;

// Function to exchange the authorization code for an access token
async function getGithubToken(code) {
    try {
        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

        const client_id = 'Ov23liUU7gvGyGV4n6f4';
        const client_secret = 'c751481076ced95b29964dd9153d4ffaac45dfa4';
        const redirect_uri = 'http://localhost:5173/callback';

        console.log('Exchanging code for token...');

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
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            throw new Error(`GitHub token exchange failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Token response received:', Object.keys(data).join(', '));

        if (data.access_token) {
            console.log('Valid token received, sending to renderer');

            // Ensure mainWindow exists before sending
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('auth-success', data.access_token);
                return true;
            } else {
                console.error('Main window is null or destroyed, cannot send token');
                return false;
            }
        } else {
            console.error('Failed to get access token:', data);

            // If we got an error message, send it to the renderer
            if (data.error_description) {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('auth-error', data.error_description);
                }
            }
            return false;
        }
    } catch (error) {
        console.error('Error during token exchange:', error);

        // Send the error to the renderer
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('auth-error', error.message);
        }
        return false;
    }
}


// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
