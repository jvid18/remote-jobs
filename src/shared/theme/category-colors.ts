type CategoryColor = {
  bg: string
  fg: string
}

export const categoryColors: Record<string, CategoryColor> = {
  'software-development': { bg: '#E7EEFB', fg: '#3E63C7' },
  design: { bg: '#ECE6FB', fg: '#6B4FC0' },
  product: { bg: '#E0F0E6', fg: '#2E8B5E' },
  marketing: { bg: '#FBEFD9', fg: '#B07A26' },
  'customer-service': { bg: '#FBE2EC', fg: '#C0507F' },
  'data-analysis': { bg: '#E4E7FB', fg: '#4655C0' },
  'finance-legal': { bg: '#E2F0DC', fg: '#4F8A36' },
}

const defaultCategoryColor: CategoryColor = { bg: '#EEEFF3', fg: '#6B6D7C' }

export function getCategoryColor(apiCategory: string): CategoryColor {
  const key = apiCategory
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  return categoryColors[key] ?? defaultCategoryColor
}
