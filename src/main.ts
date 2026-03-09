import path from 'node:path';
import { app, BrowserWindow, session, shell } from 'electron';

app.commandLine.appendSwitch('enable-experimental-web-platform-features');
app.commandLine.appendSwitch('disable-features', 'Vulkan,WebGPU');

function shouldOpenExternally(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return (
      parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:'
    );
  } catch {
    return false;
  }
}

function createWindow(): void {
  const appIconPath = path.join(app.getAppPath(), 'assets', 'icon.png');
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 980,
    minHeight: 720,
    autoHideMenuBar: true,
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (shouldOpenExternally(url)) {
      void shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (shouldOpenExternally(url)) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  const appUrl = `file://${path.join(__dirname, '..', 'vendor', 'phomymo', 'src', 'web', 'index.html')}`;
  void win.loadURL(appUrl);
}

app.whenReady().then(() => {
  const ses = session.defaultSession;

  ses.setPermissionCheckHandler((_webContents, permission: string) => {
    if (
      permission === 'usb' ||
      permission === 'serial' ||
      permission === 'bluetooth' ||
      permission === 'bluetoothScanning'
    ) {
      return true;
    }
    return false;
  });

  ses.setPermissionRequestHandler((_webContents, permission: string, callback) => {
    if (
      permission === 'usb' ||
      permission === 'serial' ||
      permission === 'bluetooth' ||
      permission === 'bluetoothScanning'
    ) {
      callback(true);
      return;
    }
    callback(false);
  });

  ses.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'usb' || details.deviceType === 'serial') {
      return true;
    }
    return false;
  });

  ses.on('select-usb-device', (event, details, callback) => {
    event.preventDefault();
    if (details.deviceList.length > 0) {
      callback(details.deviceList[0].deviceId);
      return;
    }
    callback('');
  });

  const sesEventEmitter = ses as unknown as {
    on: (eventName: string, listener: (...args: unknown[]) => void) => void;
  };

  sesEventEmitter.on('select-bluetooth-device', (event, deviceList, callback) => {
    const selectEvent = event as { preventDefault: () => void };
    const devices = deviceList as Array<{ deviceId: string }>;
    const selectCallback = callback as (deviceId: string) => void;

    selectEvent.preventDefault();
    if (devices.length > 0) {
      selectCallback(devices[0].deviceId);
      return;
    }
    selectCallback('');
  });

  ses.setUSBProtectedClassesHandler(() => {
    return [];
  });

  ses.on('select-serial-port', (event, portList, _webContents, callback) => {
    event.preventDefault();
    if (portList.length > 0) {
      callback(portList[0].portId);
      return;
    }
    callback('');
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
