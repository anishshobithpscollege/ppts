#!/usr/bin/env node
// Multi-deck helper for this repo (no dependencies, Node >= 20).
//
//   node scripts/deck.mjs list
//   node scripts/deck.mjs dev    [deck] [slidev flags]
//   node scripts/deck.mjs build  [deck] [--base /sub/path/]      (no deck = every deck + index page)
//   node scripts/deck.mjs export [deck] [pdf | pptx | all] [slidev flags]
//   node scripts/deck.mjs new    <name> [-t <template>] [--title "..."] [--author "..."]
//
// `deck` is a folder name under decks/ or any unambiguous part of it or its title.
// Omit it to pick from a list. Flags this script does not own go straight to Slidev.
import { spawn, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DECKS = join(ROOT, 'decks')
const TEMPLATES = join(ROOT, 'templates')
const SLIDEV = join(ROOT, 'node_modules', '.bin', process.platform === 'win32' ? 'slidev.cmd' : 'slidev')
const STOCK_THEMES = ['default', 'seriph'] // installed Slidev themes a deck can name directly

// ---------- discovery ----------

/** Top-level `key: value` pairs of a slides.md headmatter (enough for title, theme, ...). */
function headmatter(file) {
  const m = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const out = {}
  for (const line of (m?.[1] ?? '').split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!kv) continue
    const raw = kv[2].replace(/\s+#.*$/, '').trim() // trailing YAML comment
    const quoted = raw.match(/^(['"])(.*)\1$/)
    out[kv[1]] = quoted ? (quoted[1] === "'" ? quoted[2].replace(/''/g, "'") : quoted[2]) : raw
  }
  return out
}

function listDecks() {
  if (!existsSync(DECKS)) return []
  return readdirSync(DECKS, { withFileTypes: true })
    .filter(d => d.isDirectory() && !/^[._]/.test(d.name) && existsSync(join(DECKS, d.name, 'slides.md')))
    .map((d) => {
      const dir = join(DECKS, d.name)
      const entry = join(dir, 'slides.md')
      const fm = headmatter(entry)
      return {
        name: d.name,
        dir,
        entry,
        title: fm.title || d.name,
        template: fm.theme ? fm.theme.split('/').pop() : '-',
        exportFilename: fm.exportFilename || d.name,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function listTemplates() {
  if (!existsSync(TEMPLATES)) return []
  return readdirSync(TEMPLATES, { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(join(TEMPLATES, d.name, 'package.json')))
    .map((d) => {
      const dir = join(TEMPLATES, d.name)
      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
      return { name: d.name, dir, description: pkg.description || '', hasStarter: existsSync(join(dir, 'starter', 'slides.md')) }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

// ---------- small helpers ----------

function fail(msg) {
  console.error(`\n${msg}\n`)
  process.exit(1)
}

async function pick(label, items, show) {
  if (!process.stdin.isTTY) {
    fail(`${label}: name one of\n${items.map(i => `  ${show(i)}`).join('\n')}`)
  }
  console.log(`\n${label}`)
  items.forEach((it, i) => console.log(`  ${String(i + 1).padStart(2)}  ${show(it)}`))
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = (await rl.question('\nnumber: ')).trim()
  rl.close()
  const chosen = items[Number(answer) - 1]
  if (!chosen) fail('Nothing selected.')
  return chosen
}

async function ask(question, fallback) {
  if (!process.stdin.isTTY) return fallback
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = (await rl.question(`${question}${fallback ? ` [${fallback}]` : ''}: `)).trim()
  rl.close()
  return answer || fallback
}

async function resolveDeck(query) {
  const decks = listDecks()
  if (!decks.length) fail('No decks yet. Create one with: pnpm new <name>')
  if (!query) return decks.length === 1 ? decks[0] : pick('Which deck?', decks, d => `${d.name.padEnd(28)}${d.title}`)
  const q = query.toLowerCase()
  const exact = decks.find(d => d.name === query)
  if (exact) return exact
  for (const test of [d => d.name.toLowerCase().startsWith(q), d => d.name.toLowerCase().includes(q), d => d.title.toLowerCase().includes(q)]) {
    const hits = decks.filter(test)
    if (hits.length === 1) return hits[0]
    if (hits.length > 1) return pick(`"${query}" matches several decks`, hits, d => `${d.name.padEnd(28)}${d.title}`)
  }
  return fail(`No deck matches "${query}".\nDecks: ${decks.map(d => d.name).join(', ')}`)
}

function run(cmd, args) {
  return new Promise((done) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' })
    child.on('error', (e) => {
      console.error(`Could not start ${cmd}: ${e.message}${cmd === SLIDEV ? '\nRun "pnpm install" first.' : ''}`)
      done(1)
    })
    child.on('close', code => done(code ?? 1))
  })
}

const slidev = args => run(SLIDEV, args)

/**
 * Splits argv into the deck positionals and the flags to forward to Slidev.
 * `own` maps a flag this script handles to whether it takes a value.
 */
const VALUE_FLAGS = new Set(['--port', '-p', '--range', '--output', '-o', '--timeout', '--wait', '--wait-until', '--scale', '--width', '--height', '--theme', '--bind', '--format', '--base', '--out'])
function parseArgs(argv, own = {}) {
  const positional = []
  const flags = {}
  const forward = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--') {
      forward.push(...argv.slice(i + 1))
      break
    }
    if (a in own) {
      flags[a] = own[a] ? argv[++i] : true
    } else if (a.startsWith('-')) {
      forward.push(a)
      if (VALUE_FLAGS.has(a) && argv[i + 1] !== undefined) forward.push(argv[++i])
    } else {
      positional.push(a)
    }
  }
  return { positional, flags, forward }
}

// ---------- commands ----------

function cmdList() {
  const decks = listDecks()
  const templates = listTemplates()
  console.log('\nDecks (decks/)')
  if (!decks.length) console.log('  none yet: pnpm new <name>')
  for (const d of decks) console.log(`  ${d.name.padEnd(28)}${d.template.padEnd(18)}${d.title}`)
  console.log('\nTemplates (templates/)')
  for (const t of templates) console.log(`  ${t.name.padEnd(28)}${t.hasStarter ? 'starter' : 'no starter'}`.padEnd(48) + t.description)
  console.log(`\nStock Slidev themes also work: ${STOCK_THEMES.join(', ')}\n`)
  return 0
}

async function cmdDev(argv) {
  const { positional, flags, forward } = parseArgs(argv, { '--no-open': false })
  const deck = await resolveDeck(positional[0])
  return slidev([deck.entry, ...(flags['--no-open'] ? [] : ['--open']), ...forward])
}

async function cmdBuild(argv) {
  const { positional, flags, forward } = parseArgs(argv, { '--all': false, '--base': true })
  const prefix = (flags['--base'] ?? '/').replace(/\/?$/, '/')
  const all = flags['--all'] || !positional[0] // a bare `build` is a site build: everything
  const decks = all ? listDecks() : [await resolveDeck(positional[0])]
  if (!decks.length) fail('No decks to build.')
  const dist = join(ROOT, 'dist')
  for (const deck of decks) {
    console.log(`\n== building ${deck.name} -> dist/${deck.name}/`)
    const code = await slidev(['build', deck.entry, '--base', `${prefix}${deck.name}/`, '--out', join(dist, deck.name), ...forward])
    if (code !== 0) return code
    // The download button serves the PDF that `export` committed to exports/. (`download: true`
    // would make Slidev render one here with Chromium, which CI hosts such as Vercel do not have.)
    const pdf = join(deck.dir, 'exports', `${deck.exportFilename}.pdf`)
    if (existsSync(pdf)) cpSync(pdf, join(dist, deck.name, `${deck.exportFilename}.pdf`))
    else console.warn(`   no ${relative(ROOT, pdf)}; the download button will 404 (run: pnpm export ${deck.name} pdf)`)
  }
  if (all) {
    writeFileSync(join(dist, 'index.html'), indexPage(decks))
    console.log(`\nIndex written to dist/index.html (${decks.length} deck${decks.length === 1 ? '' : 's'}).`)
  }
  return 0
}

async function cmdExport(argv) {
  const { positional, forward } = parseArgs(argv)
  const kinds = new Set(['pdf', 'pptx', 'all'])
  const kind = positional.find(p => kinds.has(p)) ?? 'all'
  const deck = await resolveDeck(positional.find(p => !kinds.has(p)))
  const out = join(deck.dir, 'exports')
  mkdirSync(out, { recursive: true })
  const base = join(out, deck.exportFilename)
  const jobs = []
  // The exporter counts slides right after "network idle", which can come before the slides have
  // mounted and then yields an empty PDF/PPTX. One short wait makes it reliable.
  const settle = forward.includes('--wait') ? [] : ['--wait', '3000']
  if (kind !== 'pptx') {
    jobs.push([`${base}.pdf`, settle], [`${base}_click-steps.pdf`, ['--with-clicks', ...settle]])
  }
  if (kind !== 'pdf') {
    jobs.push([`${base}.pptx`, ['--format', 'pptx-editable', '--with-clicks=false', ...settle]], [`${base}_click-steps.pptx`, ['--format', 'pptx-editable', '--with-clicks', ...settle]])
  }
  for (const [file, extra] of jobs) {
    console.log(`\n== ${relative(ROOT, file)}`)
    const code = await slidev(['export', deck.entry, ...extra, '--output', file, ...forward])
    if (code !== 0) return code
  }
  // Slidev's pptx is 10 x 5.625 in; the template is 13.33 x 7.5 in widescreen with Calibri.
  const pptx = jobs.map(j => j[0]).filter(f => f.endsWith('.pptx'))
  if (pptx.length) return run('python3', [join(ROOT, 'scripts', 'pptx-widescreen.py'), ...pptx])
  return 0
}

async function cmdNew(argv) {
  const { positional, flags } = parseArgs(argv, { '--template': true, '-t': true, '--title': true, '--author': true })
  const name = positional[0]
  if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    fail('Usage: pnpm new <name> [-t <template>] [--title "..."] [--author "..."]\nname: lowercase letters, digits and hyphens, e.g. zero-trust')
  }
  const dir = join(DECKS, name)
  if (existsSync(dir)) fail(`decks/${name} already exists.`)

  const templates = listTemplates()
  const choices = [...templates.map(t => ({ name: t.name, local: t })), ...STOCK_THEMES.map(s => ({ name: s, stock: true }))]
  const wanted = flags['--template'] ?? flags['-t']
  const template = wanted
    ? choices.find(c => c.name === wanted) ?? fail(`Unknown template "${wanted}". Available: ${choices.map(c => c.name).join(', ')}`)
    : choices.length === 1 ? choices[0] : await pick('Which template?', choices, c => `${c.name.padEnd(20)}${c.local?.description ?? 'stock Slidev theme'}`)

  const gitUser = spawnSync('git', ['config', 'user.name'], { encoding: 'utf8' }).stdout.trim()
  const title = flags['--title'] ?? await ask('Title', name.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase()))
  const author = flags['--author'] ?? await ask('Author', gitUser || 'Your Name')

  const themeRef = template.local ? relative(dir, template.local.dir).split('\\').join('/') : template.name
  const vars = { TITLE: title, AUTHOR: author, NAME: name, THEME: themeRef, TEMPLATE: template.name, YEAR: String(new Date().getFullYear()) }
  // {{TITLE_YAML}} is for use inside single quotes in frontmatter, so ":" and "'" in a title are safe.
  for (const k of ['TITLE', 'AUTHOR']) vars[`${k}_YAML`] = vars[k].replace(/'/g, "''")
  const fill = text => text.replace(/\{\{(\w+)\}\}/g, (all, k) => vars[k] ?? all)

  mkdirSync(dir, { recursive: true })
  const starter = template.local && join(template.local.dir, 'starter')
  if (starter && existsSync(join(starter, 'slides.md'))) {
    cpSync(starter, dir, { recursive: true })
  } else {
    writeFileSync(join(dir, 'slides.md'), '---\ntheme: {{THEME}}\ntitle: {{TITLE}}\nauthor: {{AUTHOR}}\n---\n\n# {{TITLE}}\n')
  }
  for (const f of ['slides.md', 'README.md', 'style.css']) {
    const p = join(dir, f)
    if (existsSync(p)) writeFileSync(p, fill(readFileSync(p, 'utf8')))
  }
  console.log(`\nCreated decks/${name} from template "${template.name}".\n  pnpm dev ${name}\n`)
  return 0
}

// ---------- index page for `build --all` ----------

function indexPage(decks) {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  const rows = decks.map(d => `      <li><a href="./${esc(d.name)}/"><b>${esc(d.title)}</b><span>${esc(d.name)} &middot; ${esc(d.template)}</span></a></li>`).join('\n')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Presentations</title>
  <style>
    :root { color-scheme: light dark; --bg: #fff; --fg: #1a1a1a; --mute: #666; --line: #ddd; --accent: #cc6600; }
    @media (prefers-color-scheme: dark) { :root { --bg: #161616; --fg: #eee; --mute: #999; --line: #333; --accent: #ff9a3c; } }
    body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; }
    main { max-width: 40rem; margin: 0 auto; padding: 3rem 1rem; }
    h1 { font-size: 1.5rem; margin: 0 0 1.5rem; }
    ul { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
    li { border-bottom: 1px solid var(--line); }
    a { display: flex; flex-direction: column; padding: 0.9rem 0; color: inherit; text-decoration: none; }
    a:hover b { color: var(--accent); }
    span { color: var(--mute); font-size: 0.875rem; }
  </style>
</head>
<body>
  <main>
    <h1>Presentations</h1>
    <ul>
${rows}
    </ul>
  </main>
</body>
</html>
`
}

// ---------- entry ----------

const [command, ...rest] = process.argv.slice(2)
const commands = { list: cmdList, ls: cmdList, dev: cmdDev, build: cmdBuild, export: cmdExport, new: cmdNew }
if (!commands[command]) {
  console.log('Usage: pnpm <list | dev | build | export | new> [deck] [options]   (see README.md)')
  process.exit(command ? 1 : 0)
}
process.exit(await commands[command](rest))
