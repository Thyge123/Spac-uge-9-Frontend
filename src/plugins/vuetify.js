import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'


export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#4a90e2',
          secondary: '#ccc',
          text: '#333',
          'light-text': '#555',
          'bg-color': '#f8f9fa',
          'card-bg': '#ffffff',
          'border-color': '#e0e0e0',
          'shadow-color': 'rgba(0, 0, 0, 0.08)',
          'hover-shadow-color': 'rgba(0, 0, 0, 0.12)',
          error: '#d9534f',
          'error-bg': '#f2dede',
          'error-border': '#ebccd1',
        },
      }
    }
  }
})


