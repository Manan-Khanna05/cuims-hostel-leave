/**
 * Draws the PWA icons as a generic placeholder mark: a red disc carrying the
 * initials "CU". Nothing is traced from the institution's real logo file.
 * Run with: node scripts/make-icons.mjs
 */
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

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

const RED = [0xe1, 0x0f, 0x0f]

/** Signed distance helpers for the two letterforms. */
function inAnnulus(dx, dy, outer, thickness) {
  const d = Math.hypot(dx, dy)
  return d <= outer && d >= outer - thickness
}

function buildIcon(size) {
  const out = Buffer.alloc(size * size * 4)
  const cx = size / 2
  const cy = size / 2
  const discR = size * 0.44
  const glyphR = size * 0.15
  const stroke = size * 0.055
  const cxC = size * 0.36
  const cxU = size * 0.64

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const px = x + 0.5
      const py = y + 0.5

      let r = 255
      let g = 255
      let b = 255

      if (Math.hypot(px - cx, py - cy) <= discR) {
        r = RED[0]
        g = RED[1]
        b = RED[2]

        // "C": annulus with a wedge opened on the right.
        const dxC = px - cxC
        const dyC = py - cy
        if (inAnnulus(dxC, dyC, glyphR, stroke)) {
          const angle = Math.atan2(dyC, dxC)
          if (Math.abs(angle) > 0.72) {
            r = g = b = 255
          }
        }

        // "U": lower half annulus plus two risers.
        const dxU = px - cxU
        const dyU = py - cy
        if (dyU >= 0 && inAnnulus(dxU, dyU, glyphR, stroke)) {
          r = g = b = 255
        }
        if (
          dyU < 0 &&
          dyU >= -glyphR &&
          (Math.abs(dxU + glyphR - stroke / 2) <= stroke / 2 ||
            Math.abs(dxU - glyphR + stroke / 2) <= stroke / 2)
        ) {
          r = g = b = 255
        }
      }

      out[i] = r
      out[i + 1] = g
      out[i + 2] = b
      out[i + 3] = 255
    }
  }

  return encodePng(size, size, out)
}

for (const size of [192, 512]) {
  writeFileSync(`public/icon-${size}.png`, buildIcon(size))
  console.log(`wrote public/icon-${size}.png`)
}
