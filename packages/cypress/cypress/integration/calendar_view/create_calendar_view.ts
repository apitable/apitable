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

import { closeDescModal, closeVideoModal, createDatasheet, deleteNode } from 'cypress/support/common';
import { toolbar, ViewType } from 'cypress/support/toolbar';
import { calendar } from 'cypress/support/actions/calendar';

const CALENDAR_NAME = 'Calendar_View_Testing';

const toolbarAction = toolbar(ViewType.Calendar);
const calendarAction = calendar();

describe('Record Calendar View', () => {
  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();
  });

  it(`create ${CALENDAR_NAME}`, () => {
    createDatasheet(CALENDAR_NAME);
  });

  it('Create calendar view (no date column)', () => {
    toolbarAction.createView();
    closeVideoModal();
    calendarAction.createDate();
    toolbarAction.checkTabLength(2);
  });

  it('Create a calendar view (with date columns)', () => {
    toolbarAction.createView();
    toolbarAction.checkTabLength(3);
  });

  it(`delete ${CALENDAR_NAME}`, function() {
    deleteNode(CALENDAR_NAME);
  });
});
