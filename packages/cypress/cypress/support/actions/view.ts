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

export const getViewUtils = () => {
  return {
    gattView: 'DATASHEET_CREATE_GANTT_VIEW',
    gridView: 'DATASHEET_CREATE_GRID_VIEW',
    galleryView: 'DATASHEET_CREATE_GALLERY_VIEW',
    kanbanView: 'DATASHEET_CREATE_KANBAN_VIEW',
    getShowViewListButton() {
      return cy.get('[data-test-id=DATASHEET_SHOW_VIEW_LIST_BTN]');
    },
    addViewElement: () => {
      return cy.wait(100).get('#DATASHEET_ADD_VIEW_BTN');
    },

    assertViewCount(count: number) {
      cy.get('[data-test-id=viewTab]').should('have.length', count);
    },

    addViewButton() {
      return cy.get('#DATASHEET_ADD_VIEW_BTN');
    },

    addView(typeName: string) {
      this.addViewElement().click();
      return cy.wait(200).get(`[data-test-id=${typeName}]`).click();
    },
  };
};
