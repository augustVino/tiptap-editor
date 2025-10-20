#!/usr/bin/env node

/**
 * Simple WebSocket Server for Yjs Collaboration
 * Based on y-websocket
 */

import http from 'http'
import { WebSocketServer } from 'ws'
import { setupWSConnection } from 'y-websocket/bin/utils'

const PORT = process.env.PORT || 1234
const WSSPORT = PORT

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Yjs WebSocket Server Running\n')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req)
  console.log('Client connected')
})

server.listen(WSSPORT, () => {
  console.log(`WebSocket server running on port ${WSSPORT}`)
  console.log(`ws://localhost:${WSSPORT}`)
})
