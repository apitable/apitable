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

import { closeDescModal, createDatasheet, deleteNode } from '../../support/common';
import { getViewUtils } from '../../support/actions/view';
import { PIPE_LINE } from 'cypress/support/config';

const viewAction = getViewUtils();

describe('Test adding views and deleting views', () => {

  describe('View Toolbar', () => {

    const nodeName = 'test view';

    beforeEach(() => {
      (async() => {
        await cy.login();
      })();
      cy.link('/workbench');
      closeDescModal();
    });

    it('New Node', function() {
      createDatasheet(nodeName);
    });

    it('Add a new table view', function() {
      viewAction.addView(viewAction.gridView);
      viewAction.assertViewCount(2);
    });

    // it('New album view', function() {
    //   cy.get('body').click();
    //   viewAction.addView(viewAction.galleryView);
    //   viewAction.assertViewCount(2);
    // });

    it('New Kanban view', function() {
      viewAction.addView(viewAction.kanbanView);
      viewAction.assertViewCount(3);
    });

    it('Add Gantt Chart', function() {
      viewAction.addView(viewAction.gattView);
      viewAction.assertViewCount(4);
    });

    // it('The number of views does not exceed thirty', () => {
    //   for (let i = 4; i < 31; i++) {
    //     viewAction.addView(viewAction.gridView);
    //     cy.get('body').click();
    //   }
    //   viewAction.assertViewCount(30);
    // });

    it(`delete ${nodeName} node`, function() {
      deleteNode(nodeName);
    });
  });

  describe('View List', () => {

    const nodeName = 'test view';

    beforeEach(() => {
      (async() => {
        await cy.login();
      })();
      cy.visit(`/workbench?pipeline=${PIPE_LINE}`).wait(2000);
      closeDescModal();

    });

    it('should ', function() {
      createDatasheet(nodeName);
    });

    it('New View', function() {
      viewAction.getShowViewListButton().click();
      cy.getDomByTestId('DATASHEET_CREATE_GRID_IN_VIEW_LIST').click();
      cy.get('[data-rbd-droppable-id=view-switcher]').click();
      cy.get('[data-rbd-droppable-id=view-switcher]>div').should('have.length', 2);
    });

    it('Delete View', function() {
      viewAction.getShowViewListButton().click();
      cy.get('[data-rbd-draggable-context-id=0]').eq(1).trigger('mouseover');
      cy.get('[data-test-id=deleteViewIcon]').eq(1).click();
      cy.get('.ant-modal-root button').eq(1).click();
      viewAction.getShowViewListButton().click();
      cy.get('[data-rbd-droppable-id=view-switcher]>div').should('have.length', 1);
    });

    it('View renaming', function() {
      viewAction.getShowViewListButton().click();
      cy.get('[data-rbd-droppable-id=view-switcher] > div').first().trigger('mouseover');
      cy.get('[data-test-id=renameViewIcon]').click();
      cy.focused().clear().type(nodeName);
      cy.get('[data-rbd-droppable-id=view-switcher]').click();
      cy.get('[data-rbd-droppable-id=view-switcher]>div').contains(nodeName).should('exist');
    });

    it(`delete ${nodeName} node`, function() {
      deleteNode(nodeName);
    });
  });

});
