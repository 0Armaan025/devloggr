import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

// Get the current directory path using import.meta.url
const isDev = true;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

let mainWindow;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            scrollBounce: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'), // Optional if using preload
        },
    });

    mainWindow = win;


    // Load Vite dev server in development mode
    if (isDev) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

ipcMain.on('minimize', () => {
    // const currentWindow = BrowserWindow.getFocusedWindow();
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
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
