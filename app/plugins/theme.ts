import { getAppTheme } from '../themes'

export default defineNuxtPlugin({
  name: 'app-theme',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()
    const themeName = config.public.uiTheme

    updateAppConfig(getAppTheme(typeof themeName === 'string' ? themeName : 'default'))
  }
})
