export type AppTheme = {
  ui: {
    colors: Record<string, string>
    icons: Record<string, string>
    card: {
      slots: Record<string, string>
    }
    table: {
      slots: Record<string, string>
    }
  }
}

export const defaultTheme = {
  ui: {
    colors: {
      primary: 'emerald',
      secondary: 'teal',
      success: 'emerald',
      info: 'sky',
      warning: 'amber',
      error: 'rose',
      neutral: 'slate'
    },
    icons: {
      loading: 'i-lucide-loader-circle',
      close: 'i-lucide-x',
      check: 'i-lucide-check',
      chevronDown: 'i-lucide-chevron-down',
      chevronRight: 'i-lucide-chevron-right',
      arrowLeft: 'i-lucide-arrow-left',
      arrowRight: 'i-lucide-arrow-right'
    },
    card: {
      slots: {
        root: 'bg-elevated border border-muted'
      }
    },
    table: {
      slots: {
        th: 'text-muted',
        td: 'text-toned'
      }
    }
  }
} satisfies AppTheme
