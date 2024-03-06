import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  blockHosts: [
    '*.google-analytics.com',
    '*google-analytics.com',
    '*googleads.g.doubleclick.net',
    '*googleads4.g.doubleclick.net',
    '*googleadservices.com',
    '*pagead2.googlesyndication.com',
  ],
})
