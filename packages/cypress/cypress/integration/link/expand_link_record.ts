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

import { closeDescModal } from 'cypress/support/common';
import { getRecordUtils } from 'cypress/support/actions/record';

const recordAction = getRecordUtils();

describe('Test unfolding association records', () => {
  describe('Only the read access to the associated table, the delete button should not be displayed in the action option of expanding the associated record', () => {
    beforeEach(() => {
      (async() => {
        await cy.login('viceAccount');
      })();

      cy.link('/workbench/dst44uPc6pmp7GjVYZ/viw84T0Tfc66p');
      closeDescModal();
    });

    it('Expand read-only permissions for associated records, no entry to delete records', function() {
      recordAction.expandExactLinkRecord();
      recordAction.unVisibleDeleteRecordOption();
    });

    it('Related tables expand the card to jump to the source table correctly', function() {
      recordAction.expandExactLinkRecord();
      recordAction.gotoSourceDst();
    });
  });

});
