export type TextNode = { type: 'text'; value: string }

export type Inline =
  | TextNode
  | { type: 'strong'; children: Inline[] }
  | { type: 'emphasis'; children: Inline[] }
  | { type: 'link'; href: string; children: Inline[] }

export type ListItem = { children: Inline[] }

export type Block =
  | { type: 'paragraph'; children: Inline[] }
  | { type: 'heading'; level: 1 | 2 | 3; children: Inline[] }
  | { type: 'list'; ordered: boolean; items: ListItem[] }

export type DescriptionAst = Block[]
