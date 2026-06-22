import type { ReactNode } from 'react'
import { Linking, Text, type TextStyle, View } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'

import type { DescriptionAst, Inline } from '../job-description'

const useStyles = makeStyles(t => ({
  paragraph: {
    fontSize: t.font.size.body,
    lineHeight: 23,
    color: t.color.textSecondary,
    marginBottom: 12,
  },
  heading: {
    color: t.color.textPrimary,
    fontWeight: t.font.weight.bold,
    marginTop: 6,
    marginBottom: 10,
  },
  strong: { color: t.color.textPrimary, fontWeight: t.font.weight.bold },
  emphasis: { fontStyle: 'italic' },
  link: { color: t.color.info, textDecorationLine: 'underline' },
  list: { marginBottom: 16 },
  listItem: { flexDirection: 'row', marginBottom: 9, paddingRight: 8 },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: t.color.textFaint,
    marginTop: 8,
    marginRight: 12,
  },
  listText: { flex: 1, fontSize: t.font.size.body, lineHeight: 22, color: t.color.textSecondary },
}))

type Styles = ReturnType<typeof useStyles>

const HEADING_SIZE: Record<1 | 2 | 3, number> = { 1: 22, 2: 18, 3: 16 }

function renderInline(
  nodes: Inline[],
  styles: Styles,
  onLinkPress: (href: string) => void,
): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return <Text key={index}>{node.value}</Text>
      case 'strong':
        return (
          <Text key={index} style={styles.strong}>
            {renderInline(node.children, styles, onLinkPress)}
          </Text>
        )
      case 'emphasis':
        return (
          <Text key={index} style={styles.emphasis}>
            {renderInline(node.children, styles, onLinkPress)}
          </Text>
        )
      case 'link':
        return (
          <Text
            key={index}
            style={styles.link}
            accessibilityRole="link"
            onPress={() => onLinkPress(node.href)}
          >
            {renderInline(node.children, styles, onLinkPress)}
          </Text>
        )
    }
  })
}

export function DescriptionRenderer({ ast }: { ast: DescriptionAst }) {
  const styles = useStyles()
  const onLinkPress = (href: string) => {
    void Linking.openURL(href)
  }

  return (
    <View>
      {ast.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <Text key={index} style={styles.paragraph}>
                {renderInline(block.children, styles, onLinkPress)}
              </Text>
            )
          case 'heading':
            return (
              <Text
                key={index}
                style={[styles.heading, { fontSize: HEADING_SIZE[block.level] } as TextStyle]}
              >
                {renderInline(block.children, styles, onLinkPress)}
              </Text>
            )
          case 'list':
            return (
              <View key={index} style={styles.list}>
                {block.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>
                      {renderInline(item.children, styles, onLinkPress)}
                    </Text>
                  </View>
                ))}
              </View>
            )
        }
      })}
    </View>
  )
}
