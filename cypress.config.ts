import { defineConfig } from 'cypress';
// @ts-ignore ou use require, se necessário
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    baseUrl: 'http://localhost:4200',
  },
});
