import { readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const title = process.argv.slice(2).join(' ').trim()

if (!title) {
  console.error('Usage: node scripts/create-ai-log.js "short title"')
  process.exit(1)
}

const now = new Date()
const yyyy = now.getFullYear()
const mm = String(now.getMonth() + 1).padStart(2, '0')
const dd = String(now.getDate()).padStart(2, '0')
const date = `${yyyy}-${mm}-${dd}`

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')
  .slice(0, 50) || 'session'

const targetDir = path.resolve(__dirname, '..', 'docs', 'ai-history')
const targetPath = path.join(targetDir, `${date}_${slug}.md`)
const templatePath = path.join(targetDir, 'template.md')

try {
  await access(targetPath)
  console.error(`Log already exists: ${targetPath}`)
  process.exit(1)
} catch {
  // File does not exist, continue.
}

const template = await readFile(templatePath, 'utf8')
const author = process.env.USER || process.env.USERNAME || '<name>'

const content = template
  .replace('Date: YYYY-MM-DD', `Date: ${date}`)
  .replace('Author: <name>', `Author: ${author}`)

await writeFile(targetPath, content, 'utf8')

console.log(`Created AI log: ${targetPath}`)
