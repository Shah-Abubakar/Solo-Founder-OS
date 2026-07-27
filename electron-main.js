const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs')

let mainWindow
let backendProcess
let nextProcess

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'build', 'icon.png'),
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a',
    show: false,
    frame: true,
    titleBarStyle: 'default'
  })

  // Load the app
  mainWindow.loadURL('http://localhost:3000')

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Check if Next.js is running
function isNextRunning() {
  return new Promise((resolve) => {
    const req = require('http').get('http://localhost:3000', (res) => {
      resolve(res.statusCode === 200)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(1000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

// Start Next.js server
function startNextServer() {
  return new Promise((resolve, reject) => {
    const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next')
    const isWindows = process.platform === 'win32'
    const cmd = isWindows ? 'cmd' : 'sh'
    const args = isWindows ? ['/c', nextPath, 'start'] : ['-c', `${nextPath} start`]

    nextProcess = spawn(cmd, args, {
      cwd: __dirname,
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' }
    })

    nextProcess.stdout.on('data', (data) => {
      const output = data.toString()
      if (output.includes('started') || output.includes('ready')) {
        resolve()
      }
    })

    nextProcess.stderr.on('data', (data) => {
      console.error('Next Error:', data.toString())
    })

    setTimeout(() => resolve(), 15000)
  })
}

// Start backend server
function startBackend() {
  return new Promise((resolve) => {
    const backendPath = path.join(__dirname, 'backend', 'src', 'index.js')
    
    backendProcess = spawn('node', [backendPath], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' }
    })

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString()
      if (output.includes('running on port 3001') || output.includes('listening')) {
        resolve()
      }
    })

    backendProcess.stderr.on('data', (data) => {
      console.error('Backend Error:', data.toString())
    })

    setTimeout(() => resolve(), 5000)
  })
}

// App lifecycle
app.whenReady().then(async () => {
  console.log('Starting Solo Founder OS...')
  
  // Ensure data directory
  const dataPath = path.join(__dirname, 'data')
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true })
  }

  // Check if database exists, if not, run setup
  const dbPath = path.join(dataPath, 'solo-founder.db')
  if (!fs.existsSync(dbPath)) {
    console.log('Database not found, running setup...')
    await new Promise((resolve) => {
      const setup = spawn('npm', ['run', 'setup-db'], { cwd: __dirname, stdio: 'pipe' })
      setup.on('close', () => resolve())
      setTimeout(() => resolve(), 5000)
    })
  }

  // Start backend
  console.log('Starting backend server...')
  await startBackend()
  
  // Start Next.js
  console.log('Starting Next.js server...')
  await startNextServer()
  
  // Create window
  console.log('Creating window...')
  createWindow()
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill()
    if (nextProcess) nextProcess.kill()
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Clean up on exit
process.on('exit', () => {
  if (backendProcess) backendProcess.kill()
  if (nextProcess) nextProcess.kill()
})
