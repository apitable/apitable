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

import { closeDescModal, createDatasheet, deleteNode } from 'cypress/support/common';
import { getRecordUtils } from 'cypress/support/actions/record';
import { PIPE_LINE } from 'cypress/support/config';
import { CELL_ADD_ICON, FIRST_CELL_POSITION } from 'cypress/support/position_constant';

const recordAction = getRecordUtils();

describe('Addition and deletion of records', () => {
  before(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();

  });

  const nodeName = 'node record';

  // it('Create Node', function() {
  //   createDatasheet(nodeName);
  // });

  // it('Delete records', () => {
  //   // recordAction.getFirstCell().first().rightclick();
  //   cy.canvasRightClick(...FIRST_CELL_POSITION);
  //   cy.get('.react-contexify__item').last().click();
  //   recordAction.checkRecordLength(2);
  // });

  it('New records', function() {
    cy.canvasRightClick(...CELL_ADD_ICON);
    recordAction.checkRecordLength(3);
  });

  // it(`delete ${nodeName} node`, function() {
  //   deleteNode(nodeName);
  // });
});

