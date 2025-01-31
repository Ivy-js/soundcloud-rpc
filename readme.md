# 🎵 SCloud RPC

SCloud RPC is an Electron application that integrates SoundCloud with Discord Rich Presence. It displays the currently playing track on SoundCloud as your Discord status.


## 👀 Showcase

![Tested on Windows 11 | ARM Arch](./showcase.gif)

## 🌟 Features

- 🎶 Displays the current track title, artist, and cover art on Discord.
- 🚫 Blocks ads on SoundCloud.
- 📝 Allows enabling or disabling logs.

## 🛠️ Setup

### Prerequisites

- 📦 Node.js
- 📦 npm (Node Package Manager or Any NP Manager)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Ivy-js/soundcloud-rpc.git
    cd soundcloud-rpc
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and configure it as follows:
    ```bash
    CLIENT_ID=your_client_id
    CLIENT_SECRET=your_client_secret
    ```
    You can find `CLIENT_ID` and `CLIENT_SECRET` on the [Discord Developer Portal](https://discord.dev/).

### 🚀 Running the Application

To start the application, run:
```bash
npm start
```

You will be prompted to enable or disable logs.

### 🏗️ Building the Application

To build the application for Windows, run:
```bash
npx electron-builder build --win
```

The build output will be located in the `dist` directory.

## 📜 License

This project is licensed under the ISC License.

## 👤 Author

Created by Ivy. Contact: [contact@1sheol.xyz](mailto:contact@1sheol.xyz) | Discord : [1sheol](https://discord.com/users/1114616280138395738)#   s o u n d c l o u d - r p c  
 