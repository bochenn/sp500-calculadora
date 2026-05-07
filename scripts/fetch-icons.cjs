const https = require('https')
const fs = require('fs')
const path = require('path')

const APPS = [
  { appId: '1567954123', name: 'DolarApp' },
  { appId: '6477979345', name: 'Berry' },
  { appId: '1615111890', name: 'IOL' },
  { appId: '1318206099', name: 'Balanz' },
]

const iconDir = path.join(__dirname, '..', 'public', 'app-icons')

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error('JSON parse error: ' + data.slice(0, 100))) }
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        downloadFile(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
      res.on('error', (err) => { fs.unlink(dest, () => {}); reject(err) })
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err) })
  })
}

async function main() {
  console.log('Descargando íconos de apps...\n')

  for (const app of APPS) {
    const apiUrl = `https://itunes.apple.com/lookup?id=${app.appId}&country=ar`
    console.log(`Buscando ${app.name} (${app.appId})...`)

    try {
      const data = await fetchJson(apiUrl)

      if (!data.results || data.results.length === 0) {
        console.error(`  ✗ Sin resultados para ${app.name}`)
        continue
      }

      const iconUrl = data.results[0].artworkUrl512
      if (!iconUrl) {
        console.error(`  ✗ Sin artworkUrl512 para ${app.name}`)
        continue
      }

      const dest = path.join(iconDir, `${app.appId}.png`)
      await downloadFile(iconUrl, dest)
      const size = fs.statSync(dest).size
      console.log(`  ✓ Guardado ${app.appId}.png (${(size / 1024).toFixed(1)} KB)`)
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`)
    }
  }

  console.log('\n¡Listo!')
}

main().catch(console.error)
