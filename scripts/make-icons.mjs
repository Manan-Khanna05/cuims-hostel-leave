/**
 * Builds the PWA icons from the CUIMS logo.
 * Decodes public/cuims-logo.png, centres it on a white canvas and re-encodes
 * 192px and 512px PNGs. Run with: node scripts/make-icons.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { deflateSync, inflateSync } from 'node:zlib'

const SRC = 'public/cuims-logo.png'

/* -- PNG decode (8-bit RGBA, non-interlaced) --------------------------- */

function decodePng(buf) {
  let pos = 8 // skip signature
  let width = 0
  let height = 0
  let colorType = 6
  const idat = []

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      colorType = data[9]
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') break
    pos += 12 + len
  }

  if (colorType !== 6) throw new Error(`expected RGBA png, got colorType ${colorType}`)

  const raw = inflateSync(Buffer.concat(idat))
  const bpp = 4
  const stride = width * bpp
  const out = Buffer.alloc(height * stride)

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride)
    const cur = out.subarray(y * stride, (y + 1) * stride)

    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0
      const b = prev[x]
      const c = x >= bpp ? prev[x - bpp] : 0
      let v = line[x]
      if (filter === 1) v += a
      else if (filter === 2) v += b
      else if (filter === 3) v += (a + b) >> 1
      else if (filter === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - b)
        const pc = Math.abs(p - c)
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      cur[x] = v & 0xff
    }
  }

  return { width, height, data: out }
}

/* -- PNG encode -------------------------------------------------------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc(height * (stride + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* -- Compose ----------------------------------------------------------- */

const src = decodePng(readFileSync(SRC))

function buildIcon(size) {
  const out = Buffer.alloc(size * size * 4)

  // White plate so the dark "IMS" wordmark stays legible on any launcher.
  for (let i = 0; i < size * size; i++) {
    out[i * 4] = 255
    out[i * 4 + 1] = 255
    out[i * 4 + 2] = 255
    out[i * 4 + 3] = 255
  }

  // Fit the logo inside the maskable safe zone (~72% of the canvas).
  const target = Math.round(size * 0.72)
  const scale = Math.min(target / src.width, target / src.height)
  const dw = Math.max(1, Math.round(src.width * scale))
  const dh = Math.max(1, Math.round(src.height * scale))
  const ox = Math.round((size - dw) / 2)
  const oy = Math.round((size - dh) / 2)

  for (let y = 0; y < dh; y++) {
    const sy = Math.min(src.height - 1, Math.floor((y / dh) * src.height))
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(src.width - 1, Math.floor((x / dw) * src.width))
      const s = (sy * src.width + sx) * 4
      const d = ((oy + y) * size + (ox + x)) * 4
      const alpha = src.data[s + 3] / 255
      // Composite over the white plate.
      out[d] = Math.round(src.data[s] * alpha + out[d] * (1 - alpha))
      out[d + 1] = Math.round(src.data[s + 1] * alpha + out[d + 1] * (1 - alpha))
      out[d + 2] = Math.round(src.data[s + 2] * alpha + out[d + 2] * (1 - alpha))
      out[d + 3] = 255
    }
  }

  return encodePng(size, size, out)
}

for (const size of [192, 512]) {
  writeFileSync(`public/icon-${size}.png`, buildIcon(size))
  console.log(`wrote public/icon-${size}.png`)
}
