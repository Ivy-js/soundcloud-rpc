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

const {
  ipcMain,
  ipcRenderer,
  app,
  BrowserWindow,
  session,
  Menu,
} = require("electron");
const { Client } = require("@xhayper/discord-rpc");
require("dotenv").config();
const client = new Client({
  clientId: "1339181692233056356",
  clientSecret: "5-QC6BC--YDN_xTRteIVKy0Uo8e9Z_g7",
});
const fetch = require("cross-fetch");
let mainWindow;

const args = process.argv.slice(2);
const noConsole = args.includes("--no-console");

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

app.whenReady().then(() => {
  console.log("App is ready");
  const userSession = session.fromPartition("persist:user");
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    name: "SCloud RPC",
    icon: __dirname + "/icons/logo.ico",
    webPreferences: {
      session: userSession,
      preload: __dirname + "/preload.js",
      nodeIntegration: false,
    },
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
        "adclick.g.doubleclick.net",
      ];

      if (blockedUrls.some((url) => details.url.includes(url))) {
        console.log("\x1b[31m[BLOCKED]\x1b[0m Advertise filtered");
        callback({ cancel: true });
        return;
      }

      callback({ error: false });
    } catch (error) {
      console.error(`Error while filtering trafic: ${error}`);
    }
  });

  mainWindow.loadURL("https://soundcloud.com");

  const template = [
    {
      label: "Options",
      submenu: [
        {
          label: "🌙 Mode Sombre",
          click: () => {
            mainWindow.webContents.executeJavaScript(`
                    document.body.classList.toggle('dark-mode');
                `);
          },
        },
        {
          type: "separator",
        },
        {
          label: "X Quitter",
          role: "quit",
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  console.log("Menu created");
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.insertCSS(`
        body {
            transition: background-color 0.5s ease, color 0.5s ease;
        }
        body.dark-mode {
            background-color: #181818 !important;
            color: white !important;
        }
        body.dark-mode a {
            color:rgb(255, 255, 255) !important;
        }
        body.dark-mode .header, 
        body.dark-mode .footer, 
        body.dark-mode .navigation, 
        body.dark-mode .playControls,
        body.dark-mode .playbackSoundBadge {
            background-color: #181818 !important;
        }
        body.dark-mode .playbackSoundBadge__titleLink,
        body.dark-mode .playbackSoundBadge__lightLink {
            color: white !important;
        }
        body.dark-mode .playbackSoundBadge__titleLink:hover,
        body.dark-mode .playbackSoundBadge__lightLink:hover {
            color: #ff7700 !important;
        }
        body.dark-mode .playbackSoundBadge__titleLink:active,
        body.dark-mode .playbackSoundBadge__lightLink:active {
            color: #ff7700 !important;
        }
        body.dark-mode .playbackSoundBadge__titleLink:visited,
        body.dark-mode .playbackSoundBadge__lightLink:visited {
            color: #ff7700 !important;
        }
        body.dark-mode .playbackSoundBadge__titleLink:focus,
        body.dark-mode .playbackSoundBadge__lightLink:focus {
            color: #ff7700 !important;
        }
        body.dark-mode .playControls__inner, 
        body.dark-mode .playControls__soundBadge {
            background-color: #181818 !important;
        }
        body.dark-mode .playControls__soundBadge .image__full {
            background-color: #181818 !important;
        }
        body.dark-mode .playbackTimeline;
        body.dark-mode .playbackTimeline__progressWrapper {
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__progress {
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__waveform {
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__waveform .waveform__layer {
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__waveform .waveform__layer .waveform__part {   
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__waveform .waveform__layer .waveform__part:hover {
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__waveform .waveform__layer .waveform__part:active {    
            background-color: #ff7700 !important;
        }

        body.dark-mode .playbackTimeline__waveform .waveform__layer .waveform__part:visited {
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__waveform .waveform__layer .waveform__part:focus {
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__waveform .waveform__layer .waveform__part:after {
            background-color: #ff7700 !important;
        }
        body.dark-mode .playbackTimeline__waveform .waveform__layer .waveform__part:before {
            background-color: #ff7700 !important;
        }
        sidebarHeader__actualTitle sidebarHeader__actualTitle__webi__style {
            color: white !important;
        }
        body.dark-mode .sidebarHeader__actualTitle {
            color: white !important;
        }
        body.dark-mode .sidebarHeader__actualTitle__webi__style {
            color: white !important;
        }
        body.dark-mode .sidebarHeader__actualTitle__webi__style:hover {
            color: #ff7700 !important;
        }
        body.dark-mode .sidebarHeader__actualTitle__webi__style:active {
            color: #ff7700 !important;
        }
        body.dark-mode .sidebarHeader__actualTitle__webi__style:visited {   
            color: #ff7700 !important;
        }
        body.dark-mode .sidebarHeader__actualTitle__webi__style:focus { 
            color: #ff7700 !important;
        }
        body.dark-mode .sidebarHeader__actualTitle__webi__style:after {
            color: #ff7700 !important;
        }
        body.dark-mode .sidebarHeader__actualTitle__webi__style:before {    
            color: #ff7700 !important;
        }
        body.dark-mode .sidebarHeader__actualTitle__webi__style__webi__style {  
            color: white !important;
        }
        body.dark-mode .insightsSidebarModule__userName {
            color: white !important;
        }
        body.dark-mode .insightsSidebarModule__plays {
            color : white important;         
        }
        body.dark-mode insightsSidebarModule__timeframe {
            color: white !important;
        }
        body.dark-mode .insightsSidebarModule__button {
            color: #181818 !important;
            background-color: #ff7700 !important;   
        }
        body.dark-mode .insightsSidebarModule__button:hover {
            color: #181818 !important;
            background-color:rgb(180, 84, 0) !important;
        }
        body.dark-mode .latestUpload__seeAllYourTracks {
            color: #FFF !important;
            background-color:rgb(87, 87, 87) !important;
            outline : rgb(87, 87, 87) !important;
        }
        body.dark-mode .latestUpload__seeAllYourTracks:hover {
            color: #FFF !important;
            background-color:rgb(87, 87, 87) !important;
            outline : rgb(87, 87, 87) !important;
        }
        body.dark-mode .latestUpload__seeAllYourTracks:active {
            color: #FFF !important;  
            background-color:rgb(87, 87, 87) !important;
            outline : rgb(87, 87, 87) !important;
        }
        body.dark-mode .latestUpload__seeAllYourTracks:visited {
            color: #FFF !important;
            background-color:rgb(87, 87, 87) !important;
            outline : rgb(87, 87, 87) !important;
        }
        body.dark-mode .latestUpload__seeAllYourTracks:focus {
            color: #FFF !important;
            background-color:rgb(87, 87, 87) !important;
            outline : rgb(87, 87, 87) !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__artistName {
            color: white !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__title {
            color: white !important;
        }
        body .dark-mode .latestUploadContainer__soundDetails__title:hover { 
            color: #ff7700 !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__title:active {
            color: #ff7700 !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__title:visited {
            color: #ff7700 !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__title:focus {
            color: #ff7700 !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__title:after {
            color: #ff7700 !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__title:before {
            color: #ff7700 !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__stats {
            color: white !important;
        }
        body.dark-mode .latestUploadContainer__soundDetails__actions soundActions__small {
            color:rgb(255, 255, 255) !important;
            background-color:rgb(87, 87, 87) !important;
        }
            
        body.dark-mode .insightsSidebarModule__title {
            color: white !important;
        }
        
        body.dark-mode .player {
            background-color: #202020 !important;
        }
        body.dark-mode .sc-button-group .sc-button-group-small
        {
            color: #FFF !important;
            background-color:rgb(87, 87, 87) !important;
            outline : rgb(87, 87, 87) !important;
        }
        body.dark-mode .playControls__background,
        body.dark-mode .playControls__elements,
        body.dark-mode .playControls__timeline,
        body.dark-mode .playControls__buttons {
            background-color: #181818 !important;
            color: white !important;
        }

        body.dark-mode .playbackTimeline__background,
        body.dark-mode .playbackTimeline__progress,
        body.dark-mode .playbackTimeline__waveform {
            background-color: #181818 !important;
            color: white !important;
        }
        body.dark-mode .searchTitle {
            color: white !important;
            background-color: #181818 !important;
        }
        body.dark-mode .commentForm__wrapper {
            background-color: #181818 !important;
            color : white !important;
        }
        body.dark-mode .commentForm__input {
            background-color: #181818 !important;
            color : white !important;
        }
        body.dark-mode .compactTrackListItem__content {
            background-color: #181818 !important;
            color : white !important;
        } 
        body.dark-mode .compactTrackListItem__content:hover {
            background-color: #181818 !important;
            color : #ff7700 !important;
        } 
        body.dark-mode .headerMenu {
            background-color: #181818 !important;
            color : white !important;
        }
        body.dark-mode .headerMenu__item {
            background-color: #181818 !important;
            color : white !important;
        }
        body.dark-mode .headerMenu__item:hover {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .headerMenu__item:active {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .headerMenu__item:visited {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .headerMenu__item:focus {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .headerMenu__item:after {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .headerMenu__item:before {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .dropdownContent__container {
            background-color: #181818 !important;
            color : white !important;
        }
        body.dark-mode .dropdownContent__container:hover {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .dropdownContent__container:active {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .dropdownContent__container:visited {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .dropdownContent__container:focus {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .dropdownContent__container:after {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .dropdownContent__container:before {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .soundBadge__additional:hover {
            background-color: #181818 !important;
            color : white !important;
        }    
        body.dark-mode .volume__sliderWrapper {
            background-color: #181818 !important;
            color : white !important;
        }
        body.dark-mode .localeSelector_language {
            background-color: #181818 !important;
            color : #ff7700 !important;
        }
        body.dark-mode .collectionNav .g-tabs-item.networkTabs__item:hover {
            color: #ff7700 !important;
        }
        body.dark-mode .userDropbar {
            background-color: #181818 !important;
            color: white !important; 
        }
        body.dark-mode .dropbar__content {
            background-color: #181818 !important; 
        }
        body.dark-mode .dropbar {
            background-color: #181818 !important;
        }
        body.dark-mode .profileUploadFooter {
            background-color: #181818 !important;
            color: white !important;
        }

    `);
    mainWindow.webContents.executeJavaScript(`
        document.body.classList.add('dark-mode');
    `);
  });
});
ipcMain.on("toggle-dark-mode", () => {
  mainWindow.webContents.send("toggle-dark-mode");
});

ipcMain.on("update-rpc", (event, { title, artist, cover, trackLink, isPlaying  }) => {
  console.log("update-rpc event received:", {
    title,
    artist,
    cover,
    trackLink,
    isPlaying,
  });

  console.log(`Music State : ${isPlaying}`);
  console.log("Title: ", title);

  // 500x500 url

  let controlImg, controlState;
  if (isPlaying) {
    controlImg = "https://i.imgur.com/3BG8sJ4.png";
    controlState = "Playing";
  } else {
    controlImg = "https://i.imgur.com/mh5yh1z.png";
    controlState = "Pause";
  }

  const coverUrl = cover.replace("-t50x50", "-t500x500");
  console.log("Cover URL: ", coverUrl);
  client.user?.setActivity({
    details: title,
    state: artist,
    largeImageKey: coverUrl,
    smallImageKey: controlImg,
    // smallImageText: controlState,
    type: 2,
    startTimestamp: new Date(),
    buttons: [
      {
        label: `Listen in App`,
        url: trackLink,
      },
      {
        label: `GitHub`,
        url: `https://github.com/ivy-js/soundcloud-rpc`,
      },
    ],
  });
  console.log(
    `\x1b[36m[DISCORD]\x1b[0m | Mise à jour de la présence : ${title} - ${artist}`
  );
});
client.on("ready", () => {
  console.log(
    "\x1b[36m[DISCORD]\x1b[0m" +
      ` | ${client.user.username} est connecté à Discord.`
  );
});
client
  .login()
  .then(() => {
    console.log("Discord client logged in");
  })
  .catch(console.error);
