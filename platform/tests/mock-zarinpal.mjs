import http from 'node:http'

const port = Number(process.env.MOCK_ZARINPAL_PORT || 8790)
let nextMode = 'success'
let counter = 0
const authorities = new Map()

function send(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) })
  res.end(body)
}

async function readJson(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1:' + port)

  if (req.method === 'POST' && url.pathname === '/__mode') {
    const body = await readJson(req).catch(() => ({}))
    nextMode = String(body.mode || 'success')
    return send(res, 200, { ok: true, mode: nextMode })
  }

  if (req.method === 'POST' && url.pathname === '/request.json') {
    await readJson(req).catch(() => ({}))
    const mode = nextMode
    nextMode = 'success'

    if (mode === 'request_reject') {
      return send(res, 200, { data: { code: -9, message: 'mock request rejection' }, errors: [] })
    }

    const authority = 'AUTH_' + mode.toUpperCase() + '_' + (++counter)
    authorities.set(authority, mode)
    return send(res, 200, { data: { code: 100, authority, message: 'mock accepted' }, errors: [] })
  }

  if (req.method === 'POST' && url.pathname === '/verify.json') {
    const body = await readJson(req).catch(() => ({}))
    const authority = String(body.authority || '')
    const mode = authorities.get(authority) || 'success'

    if (mode === 'verify_fail') {
      return send(res, 200, { data: { code: -21, message: 'mock verify failure' }, errors: [] })
    }

    return send(res, 200, {
      data: {
        code: 100,
        ref_id: 900000 + counter,
        card_hash: 'mock-card-hash',
        card_pan: '0000-****-****-0000'
      },
      errors: []
    })
  }

  if (url.pathname.startsWith('/start/')) {
    res.writeHead(200, { 'content-type': 'text/plain' })
    return res.end('mock payment page')
  }

  return send(res, 404, { ok: false })
})

server.listen(port, '127.0.0.1', () => {
  console.log('MOCK_ZARINPAL_READY=' + port)
})
