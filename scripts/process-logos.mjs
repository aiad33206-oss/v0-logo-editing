import sharp from 'sharp'

// لون الصفحة الرئيسي (توتي وردي) #a43c64
const TINT = { r: 0xa4, g: 0x3c, b: 0x64 }

async function recolor(input, output, mode) {
  const img = sharp(input).ensureAlpha()
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.alloc(width * height * 4)

  for (let i = 0, p = 0; i < data.length; i += channels, p += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    let ink
    if (mode === 'fromBlack') {
      // الشعار فاتح على خلفية سوداء -> السطوع هو الحبر
      ink = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    } else {
      // الشعار ملوّن على خلفية بيضاء -> البُعد عن الأبيض هو الحبر
      ink = 1 - Math.min(r, g, b) / 255
    }

    // منحنى لطيف لإزالة الضوضاء الخفيفة في الخلفية
    let a = Math.max(0, (ink - 0.12) / 0.88)
    a = Math.min(1, a)

    out[p] = TINT.r
    out[p + 1] = TINT.g
    out[p + 2] = TINT.b
    out[p + 3] = Math.round(a * 255)
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .trim()
    .toFile(output)

  console.log('[v0] wrote', output)
}

await recolor('public/abdelrahman-logo.png', 'public/abdelrahman-mark.png', 'fromBlack')
await recolor('public/azhar-logo.jpg', 'public/azhar-mark.png', 'fromWhite')
