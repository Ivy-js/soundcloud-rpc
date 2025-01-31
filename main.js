/* ******************************************************************************************************* */
/*                                                                                                         */
/*                                                              :::::::::::    :::     :::    :::   :::    */
/*   main.js                                                    :+:        :+:     :+:    :+:   :+:        */
/*                                                             +:+        +:+     +:+ +:+          */
/*   By: ivy <contact@1sheol.xyz>                              +#+        +#+     +:+      +#++:            */
/*                                                           +#+         +#+   +#+        +#+              */
/*   Created: 2025/01/30 21:34:08 by ivy                     #+#         #+#+#+#         #+#                */
/*   Updated: 2025/01/30 21:34:08 by ivy               ###########        ###           ###                 */
/*                                                                                                         */
/* ******************************************************************************************************* */

const { ipcMain,ipcRenderer, app, BrowserWindow, session } = require('electron');
const { Client } = require("@xhayper/discord-rpc")
require('dotenv').config();
const client = new Client({
    clientId : process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})
const { ElectronBlocker } = require('@ghostery/adblocker-electron');
const fetch = require('cross-fetch');
let mainWindow;

const args = process.argv.slice(2);
const noConsole = args.includes('--no-console');

if (noConsole) {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
}

app.on("web-contents-created", (_, contents) => {
    contents.on("preload-error", (_, error) => {
        console.error("Preload error:", error);
    });

    contents.on("render-process-gone", (_, details) => {
        console.warn("Renderer process crashed:", details);
    });

    contents.on("uncaught-exception", (_, error) => {
        console.error("Uncaught exception:", error);
    });
});

app.on('ready', () => {
    console.log('App is ready');
    const userSession = session.fromPartition('persist:user'); 
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        name : "SCloud RPC",
        icon: __dirname + '/icons/icon.ico', 
        webPreferences: {
            session: userSession, 
            preload: __dirname + '/preload.js',
            nodeIntegration: false, 
        },
    });

    ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
        blocker.enableBlockingInSession(session.defaultSession);
        blocker.enableBlockingInSession(userSession);
    });


    // trafic filtering

    userSession.webRequest.onBeforeRequest((details, callback) => {

        try {
            const blockedUrls = [
                "adswizz.com",
                "soundcloud.com/ads",
                "doubleclick.net",
                "googleadservices.com",
                "securepubads.g.doubleclick.net",
                "pagead2.googlesyndication.com",
                "adclick.g.doubleclick.net"
            ]; 
    
            
            if (blockedUrls.some(url => details.url.includes(url))) {
                console.log('\x1b[31m[BLOCKED]\x1b[0m Advertise filtered');
                callback({ cancel: true });
                return;
            }

            callback({ error : false });
        } catch (error) {
            console.error(`Error while filtering trafic: ${error}`);
        }
    })
    
    mainWindow.loadURL('https://soundcloud.com');
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`
            (function() {
                function blockAudioAds() {
                    const audios = document.querySelectorAll('audio, video');
                    audios.forEach(audio => {
                        if (audio.src && audio.src.includes('ads')) { 
                            console.log('\x1b[31m[BLOCKED]\x1b[0m Audio ad founded :', audio.src);
                            audio.volume = 0;
                        } else {
                            audio.volume = 1;   
                        }
                    });
                }
                setInterval(blockAudioAds, 1000);
            })();
        `);
    });
});

ipcMain.on("update-rpc", (event, { title, artist,cover,trackLink }) => {
    console.log('update-rpc event received:', { title, artist,cover,trackLink });

    console.log("Title: ", title);
    const justTitle = title.replace("Titre en cours :", "🍃 ").split('[')[0].trim();
    const titleParts = justTitle.split(/(?=[A-Z])/);
    const uniqueTitleParts = [...new Set(titleParts)];
    const cleanedTitle = uniqueTitleParts.join('');

    // 500x500 url 

    const coverUrl = cover.replace('-t50x50', '-t500x500');
    console.log("Cover URL: ", coverUrl);
    client.user?.setActivity({
        details: cleanedTitle,
        state: artist,
        largeImageKey: coverUrl, 
        largeImageText: `${cleanedTitle} - ${artist}`,
        type: 2,
        startTimestamp: new Date(),
        buttons: [
            {
                label: `Listen in App`,
                url: trackLink
            }
        ]

    });
    console.log(`\x1b[36m[DISCORD]\x1b[0m | Mise à jour de la présence : ${title} - ${artist}`);
});

client.on("ready", () => {
    console.log("\x1b[36m[DISCORD]\x1b[0m" + ` | ${client.user.username} est connecté à Discord.`);
})
client.login().then(() => {
    console.log('Discord client logged in');
}).catch(console.error);
