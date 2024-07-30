import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronFront', {
  salvarComanda: async (data) => ipcRenderer.send('postData', data),
  getComanda: async (index) => ipcRenderer.invoke('getData', index),
  getComandas: async () => ipcRenderer.invoke('getComandas'),
  limparComandas: async () => ipcRenderer.invoke('limparComandas')
})
