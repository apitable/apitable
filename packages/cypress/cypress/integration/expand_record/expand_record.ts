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
import { getNotifyUtils } from 'cypress/support/actions/notify';
import { toolbar, ViewType } from 'cypress/support/toolbar';

const recordAction = getRecordUtils();
const notifyAction = getNotifyUtils();
const toolbarAction = toolbar(ViewType.Vika);

describe('Expand Record Test', () => {
  const nodeName = 'expand record';

  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();
  });

  it(`create ${nodeName} node`, function() {
    createDatasheet(nodeName);
  });

  it('Insert row to expand the card correctly', function() {
    toolbarAction.insertRow();
    recordAction.existExpandRecord(true);
  });

  it('Is the copy link in the expansion card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.copyExpandRecordLink();
  });

  it('Is the deletion in the expansion card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.deleteExpandRecord();
  });

  it('Is the comment in the expansion card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.submitComment();
  });

  it('Is the delete comment in the expansion card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.deleteComment();
  });

  it('Are the unfolding and folding dynamics in the unfolded card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.expandToggleActivity();
  });

  it('Notification Center expands the card correctly', function() {
    notifyAction.enterNotify();
    notifyAction.enterNotifyList();
    notifyAction.expandRecord();
  });

  it(`delete ${nodeName} node`, function() {
    deleteNode(nodeName);
  });
});
