import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Comanda } from './model/user.model'
import { initDb } from './db/database'

const llamarNode = async (e, data) => {

  const comanda = new Comanda({ ...data });

  try {
    const usuarioGuardado = await comanda.save();

    console.log('Comanda Salva:', usuarioGuardado.toJSON());
  } catch (error) {
    console.error('Erro ao salvar a comanda:' + error);
  }
}
const obtenerUsuarioById = async (e, index) => {
  try {
    const usuarioById = await Comanda.findByPk(index); 
    return usuarioById;
  } catch (error) {

  }
}
const getComandas = async (e) => {
  try {
    const allComandas = await Comanda.findAll();
    console.log("🚀 ~ file: index.js:32 ~ getComandas ~ allComandas:", allComandas)

    return allComandas;
  } catch (error) {
    console.error("Erro ao buscar comandas:", error);
    throw new Error("Erro ao buscar comandas");
  }
}


const limparComandas = async () => {
  try {
    await Comanda.destroy({ where: {}, truncate: true });
    console.log('Todas as comandas foram apagadas.');
  } catch (error) {
    console.error('Erro ao limpar as comandas:', error);
    throw new Error('Erro ao limpar as comandas');
  }
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,


    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()

  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  initDb();
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  //ELECTRON LLAMADAS

  ipcMain.on('postData', llamarNode)
  ipcMain.handle('getData', obtenerUsuarioById)






})

ipcMain.handle('getComandas', async (event) => {
  try {
    const comandas = await getComandas();
    console.log("🚀 ~ file: index.js:115 ~ ipcMain.handle ~ comandas:", comandas)
    return comandas;
  } catch (error) {
    console.error(error);
    return { error: error.message }; // Retorna um objeto de erro que pode ser tratado pelo cliente
  }
});
ipcMain.handle('limparComandas', async (event) => {
  try {
    await limparComandas();
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
