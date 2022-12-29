/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const stylelint = require('stylelint');

const {
  report,
  ruleMessages,
  validateOptions,
} = stylelint.utils;

const ruleName = 'plugin/font-weight-no-number';
const messages = ruleMessages(ruleName, {
  expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

module.exports = stylelint.createPlugin(ruleName, function getPlugin(primaryOption) {
  return function lint(postcssRoot, postcssResult) {
    const validOptions = validateOptions(
      postcssResult,
      ruleName, {
        actual: primaryOption,
        possible: ['named-only'],
      }
    );

    if (!validOptions) { //If the options are invalid, don't lint
      return;
    }
    postcssRoot.walkDecls(decl => { //Iterate CSS declarations
      if (decl.prop.toLowerCase() === 'font-weight') {
        if (isNaN(Number(decl.value))) {
          return; //Nothing to do with this node - continue
        }
        //We are in “report only” mode
        report({
          ruleName,
          result: postcssResult,
          message: messages.expected('number', 'named'), // Build the reported message
          node: decl, // Specify the reported node
          index: 'font-weight: '.length,
          word: 'number', // Which exact word caused the error? This positions the error properly
        });
      }
    });
  };
});

module.exports.messages = messages;
module.exports.ruleName = ruleName;