import { type ChildNode, type Element, isTag, isText } from 'domhandler'
import { parseDocument } from 'htmlparser2'

import type { Block, DescriptionAst, Inline, ListItem } from '@/modules/jobs/job-description'

const MAX_DEPTH = 8
const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'ul', 'ol'])
const DROP_CONTENT_TAGS = new Set(['script', 'style', 'template', 'head'])

function isSafeHref(href: string): boolean {
  return /^https?:\/\//i.test(href.trim())
}

function headingLevel(tag: string): 1 | 2 | 3 {
  return parseInt(tag[1], 10) as 1 | 2 | 3
}

function inlineFrom(nodes: ChildNode[], depth: number): Inline[] {
  if (depth > MAX_DEPTH) return []

  const out: Inline[] = []
  for (const node of nodes) {
    if (isText(node)) {
      if (node.data) out.push({ type: 'text', value: node.data })
      continue
    }
    if (!isTag(node)) continue

    const tag = node.name.toLowerCase()
    if (DROP_CONTENT_TAGS.has(tag)) continue

    switch (tag) {
      case 'strong':
      case 'b':
        out.push({ type: 'strong', children: inlineFrom(node.children, depth + 1) })
        break
      case 'em':
      case 'i':
        out.push({ type: 'emphasis', children: inlineFrom(node.children, depth + 1) })
        break
      case 'a': {
        const href = node.attribs.href ?? ''
        const children = inlineFrom(node.children, depth + 1)
        if (isSafeHref(href)) out.push({ type: 'link', href: href.trim(), children })
        else out.push(...children) // drop unsafe link, keep text
        break
      }
      case 'br':
        out.push({ type: 'text', value: '\n' })
        break
      default:
        out.push(...inlineFrom(node.children, depth + 1)) // unwrap unknown inline tag
    }
  }

  return out
}

function listItemsFrom(el: Element, depth: number): ListItem[] {
  return el.children
    .filter((n): n is Element => isTag(n) && n.name.toLowerCase() === 'li')
    .map(li => ({ children: inlineFrom(li.children, depth + 1) }))
}

function blocksFrom(nodes: ChildNode[], depth: number): Block[] {
  if (depth > MAX_DEPTH) return []

  const out: Block[] = []
  let pending: Inline[] = []

  const flush = () => {
    const meaningful = pending.some(n => n.type !== 'text' || n.value.trim() !== '')
    if (meaningful) out.push({ type: 'paragraph', children: pending })
    pending = []
  }

  for (const node of nodes) {
    if (isText(node)) {
      if (node.data?.trim()) pending.push({ type: 'text', value: node.data })
      continue
    }
    if (!isTag(node)) continue

    const tag = node.name.toLowerCase()
    if (DROP_CONTENT_TAGS.has(tag)) continue

    if (!BLOCK_TAGS.has(tag)) {
      if (tag === 'br') continue // ignore stray line breaks between blocks

      // unknown wrapper (div, section, span…): lift nested blocks, else treat as inline
      const nested = blocksFrom(node.children, depth + 1)
      if (nested.length > 0) {
        flush()
        out.push(...nested)
      } else pending.push(...inlineFrom(node.children, depth + 1))
      continue
    }

    flush()

    switch (tag) {
      case 'p':
        out.push({ type: 'paragraph', children: inlineFrom(node.children, depth + 1) })
        break
      case 'ul':
      case 'ol':
        out.push({ type: 'list', ordered: tag === 'ol', items: listItemsFrom(node, depth + 1) })
        break
      default: // h1, h2, h3
        out.push({
          type: 'heading',
          level: headingLevel(tag),
          children: inlineFrom(node.children, depth + 1),
        })
    }
  }

  flush()
  return out
}

export function htmlToAst(html: string): DescriptionAst {
  if (!html) return []
  const doc = parseDocument(html, { decodeEntities: true })
  return blocksFrom(doc.children, 0)
}
