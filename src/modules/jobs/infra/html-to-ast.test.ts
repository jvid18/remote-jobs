import { htmlToAst } from '@/modules/jobs/infra/html-to-ast'

describe('htmlToAst', () => {
  it('maps paragraphs and inline emphasis', () => {
    const ast = htmlToAst('<p>Hello <strong>world</strong></p>')
    expect(ast).toEqual([
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'Hello ' },
          { type: 'strong', children: [{ type: 'text', value: 'world' }] },
        ],
      },
    ])
  })

  it('maps unordered lists to list nodes', () => {
    const ast = htmlToAst('<ul><li>One</li><li>Two</li></ul>')
    expect(ast).toEqual([
      {
        type: 'list',
        ordered: false,
        items: [
          { children: [{ type: 'text', value: 'One' }] },
          { children: [{ type: 'text', value: 'Two' }] },
        ],
      },
    ])
  })

  it('maps h2 to a heading node with its level', () => {
    expect(htmlToAst('<h2>About</h2>')).toEqual([
      { type: 'heading', level: 2, children: [{ type: 'text', value: 'About' }] },
    ])
  })

  it('keeps http(s) links and drops unsafe ones while preserving their text', () => {
    expect(htmlToAst('<p><a href="https://x.com">safe</a></p>')).toEqual([
      {
        type: 'paragraph',
        children: [
          { type: 'link', href: 'https://x.com', children: [{ type: 'text', value: 'safe' }] },
        ],
      },
    ])
    expect(htmlToAst('<p><a href="javascript:alert(1)">x</a></p>')).toEqual([
      { type: 'paragraph', children: [{ type: 'text', value: 'x' }] },
    ])
  })

  it('drops disallowed tags and unwraps their text content', () => {
    const ast = htmlToAst('<p>ok<script>steal()</script></p>')
    expect(ast).toEqual([{ type: 'paragraph', children: [{ type: 'text', value: 'ok' }] }])
  })

  it('decodes html entities', () => {
    expect(htmlToAst('<p>a &amp; b</p>')).toEqual([
      { type: 'paragraph', children: [{ type: 'text', value: 'a & b' }] },
    ])
  })

  it('returns an empty AST for empty input', () => {
    expect(htmlToAst('')).toEqual([])
  })
})
