/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const stylelint = require('stylelint');

const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'plugin/font-weight-no-number';
const messages = ruleMessages(ruleName, {
  expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

module.exports = stylelint.createPlugin(ruleName, function getPlugin(primaryOption) {
  return function lint(postcssRoot, postcssResult) {
    const validOptions = validateOptions(postcssResult, ruleName, {
      actual: primaryOption,
      possible: ['named-only'],
    });

    if (!validOptions) {
      //If the options are invalid, don't lint
      return;
    }
    postcssRoot.walkDecls((decl) => {
      //Iterate CSS declarations
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
