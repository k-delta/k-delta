import { defineConfig } from 'astro/config'
import { URL } from './src/data/constants'

import tunnel from 'astro-tunnel'
import icon from 'astro-icon'
import { astroImageTools } from 'astro-imagetools'
import i18n from '@astrolicious/i18n'
import sitemap from 'astro-sitemap'
import playformCompress from '@playform/compress'
import compressor from 'astro-compressor'

// https://astro.build/config
export default defineConfig({
  // Configuración para GitHub Pages
  // Si tu repositorio se llama k-delta/k-delta (no es el repositorio de usuario),
  // necesitas el base. Si es k-delta/k-delta.github.io, usa base: '/'
  base: process.env.NODE_ENV === 'production' ? '/k-delta/' : '/',
  site: process.env.NODE_ENV === 'production'
    ? 'https://k-delta.github.io'
    : URL,
  // Image optimization is enabled by default in Astro 3.0+
  // No need for explicit passthrough service
  server: {
    host: true
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  compressHTML: false,
  integrations: [
    tunnel(),
    icon(),
    astroImageTools,
    i18n({
      defaultLocale: 'es',
      locales: ['es', 'en']
    }),
    sitemap({
      canonicalURL: process.env.NODE_ENV === 'production'
        ? 'https://k-delta.github.io'
        : URL,
      lastmod: new Date(),
      createLinkInHead: false,
      xmlns: {
        xhtml: true,
        news: false,
        video: false,
        image: false
      },
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es'
        }
      },
      // Remove trailing slash
      serialize(item) {
        /* eslint-disable-next-line no-param-reassign */
        item.url = item.url.replace(/\/$/g, '')
        return item
      }
    }),
    playformCompress({
      HTML: {
        collapseBooleanAttributes: true,
        maxLineLength: 0,
        removeAttributeQuotes: false,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
      },
      JavaScript: {
        compress: {
          ecma: 2015
        },
        format: {
          comments: false,
          ecma: 2015
        },
        ecma: 2015,
        module: true
      },
      Image: false,
      SVG: false
    }),
    compressor()
  ]
})
