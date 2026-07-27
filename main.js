const { spawn } = require('child_process')
const path = require('path')

const ROOT = __dirname
const BACKEND = path.join(ROOT, 'backend')

let nextProcess = null
let backendProcess = null

function startNext() {
  return new Promise((resolve, reject) => {
    nextProcess = spawn('npx', ['next', 'dev'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PORT: '3000' },
      shell: true,
    })

    nextProcess.stdout.on('data', (data) => {
      const text = data.toString()
      process.stdout.write(`[next] ${text}`)
      if (text.includes('localhost:3000') || text.includes('ready')) {
        resolve()
      }
    })

    nextProcess.stderr.on('data', (data) => {
      process.stderr.write(`[next:err] ${data}`)
    })

    nextProcess.on('error', reject)
    nextProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`Next.js exited with code ${code}`)
      }
    })

    setTimeout(() => resolve(), 8000)
  })
}

function startBackend() {
  return new Promise((resolve, reject) => {
    backendProcess = spawn('node', ['src/index.js'], {
      cwd: BACKEND,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PORT: '3001' },
      shell: true,
    })

    backendProcess.stdout.on('data', (data) => {
      const text = data.toString()
      process.stdout.write(`[backend] ${text}`)
      if (text.includes('running on http')) {
        resolve()
      }
    })

    backendProcess.stderr.on('data', (data) => {
      process.stderr.write(`[backend:err] ${data}`)
    })

    backendProcess.on('error', reject)
    backendProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`Backend exited with code ${code}`)
      }
    })

    setTimeout(() => resolve(), 5000)
  })
}

function openBrowser() {
  try {
    const open = require('open')
    open('http://localhost:3000')
    console.log('Opened browser to http://localhost:3000')
  } catch {
    console.log('Open browser to http://localhost:3000')
  }
}

function shutdown() {
  console.log('\nShutting down...')
  if (nextProcess) { nextProcess.kill('SIGTERM'); nextProcess = null }
  if (backendProcess) { backendProcess.kill('SIGTERM'); backendProcess = null }
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('exit', shutdown)

async function main() {
  console.log('Starting Solo Founder OS...\n')

  try {
    console.log('Starting backend (port 3001)...')
    await startBackend()
    console.log('Backend is running\n')

    console.log('Starting frontend (port 3000)...')
    await startNext()
    console.log('Frontend is running\n')

    openBrowser()
    console.log('\nSolo Founder OS is ready!')
    console.log('  Frontend: http://localhost:3000')
    console.log('  Backend:  http://localhost:3001')
    console.log('\nPress Ctrl+C to stop all services.')
  } catch (err) {
    console.error('Failed to start:', err)
    shutdown()
  }
}

main()
