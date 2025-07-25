/**
 * @type {Cypress.PluginConfig}
 */
import codeCoverageTask from '@cypress/code-coverage/task';

export default (on, config) => {
  return codeCoverageTask(on, config);
};
