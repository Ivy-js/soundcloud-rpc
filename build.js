const { existsSync, rmSync } = require("fs");
const { resolve, join } = require("path");
const builder = require("electron-builder");

// If the Electron app build folder exists, we need to delete it
if (existsSync(resolve("dist"))) {
  rmSync(resolve("dist"), { recursive: true });
  console.log('Removed "dist" directory');
}

// App build
console.log("Building setup...");
const config = {
  appId: "com.github.1sheol.soundcloud-discord-rpc",
  productName: "SCloud RPC",
  mac: {
    category: "public.app-category.music",
    target: "dmg",
    icon: join(__dirname, "/icons/icon.png"),
  },
  win: {
    target: "nsis",
    icon: join(__dirname, "/icons/icon.ico"),
  },
  linux: {
    category: "Audio;AudioVideo",
    target: ["snap", "AppImage", "deb", "rpm"],
    icon: join(__dirname, "/icons/icon.png"),
  },
  files: [
    "main.js",
    "preload.js",
  ],
};

const specifiedOS = process.argv[2];
if (specifiedOS) {
  if (specifiedOS === "windows") {
    config.mac = undefined;
    config.linux = undefined;
  } else if (specifiedOS === "macos") {
    config.linux = undefined;
    config.win = undefined;
  } else if (specifiedOS === "linux") {
    config.mac = undefined;
    config.win = undefined;
  }
} else {
  if (process.platform === "win32") {
    config.mac = undefined;
    config.linux = undefined;
  }
}

builder
  .build({
    config,
    publish: "never",
  })
  .then(() => {
    console.log('\nSetup built in the "dist" folder.');
  });
