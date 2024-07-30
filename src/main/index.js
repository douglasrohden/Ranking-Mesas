import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Comanda } from './model/user.model'
import { License } from './model/license.model'
import { initDb } from './db/database'

const isLicenseValid = async () => {
  try {
    const license = await License.findOne();
    return license && license.isValid;
  } catch (error) {
    console.error('Erro ao verificar a licença:', error);
    return false;
  }
};
const checkLicense = async () => {
  if (!(await isLicenseValid())) {
    console.error('Licença inválida.');
    dialog.showMessageBox({
      type: 'error',
      title: 'Licença Inválida',
      message: 'A licença do aplicativo é inválida. Por favor, contate o suporte, 66-99623 9444.',
    });

    return false;
  } else {
    return true;
  }

}
const adicionarComanda = async (e, data) => {
  if (!(await checkLicense())) return;
  const comanda = new Comanda({ ...data });

  try {
    const usuarioGuardado = await comanda.save();

    console.log('Comanda Salva:', usuarioGuardado.toJSON());
  } catch (error) {
    console.error('Erro ao salvar a comanda:' + error);
  }
}
const getNomeComandaById = async (e, comanda) => {
  try {
    const usuarioByComanda = await Comanda.findOne({
      where: { comanda: comanda }
    });
    console.log("teste", usuarioByComanda);
    return usuarioByComanda;
  } catch (error) {
    console.error('Error fetching comanda:', error);
  }
}

const getComandas = async (e) => {

  try {
    const allComandas = await Comanda.findAll();

    return allComandas;
  } catch (error) {
    console.error("Erro ao buscar comandas:", error);
    throw new Error("Erro ao buscar comandas");
  }
}


const limparComandas = async () => {

  if (!(await checkLicense())) return;
  try {
    await Comanda.destroy({ where: {}, truncate: true });
    console.log('Todas as comandas foram apagadas.');
  } catch (error) {
    console.error('Erro ao limpar as comandas:', error);
    throw new Error('Erro ao limpar as comandas');
  }
}


async function createWindow() {

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
  
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  initDb();

  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });



});

ipcMain.on('postData', adicionarComanda);
ipcMain.handle('getData', getNomeComandaById);

ipcMain.handle('getComandas', async () => {
  try {
    const comandas = await getComandas();
    return comandas;
  } catch (error) {
    console.error(error);
    return { error: error.message };
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
