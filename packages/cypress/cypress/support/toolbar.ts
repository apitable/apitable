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

export enum ViewType {
  Calendar = 'calendar',
  Vika = 'vika'
}

export const toolbar = (viewType: ViewType) => ({
  elements: {
    addBtn: '#DATASHEET_ADD_VIEW_BTN',
    tabList: '[data-test-id=tabList]',
    tabListChildren: '[data-rbd-droppable-id=view-bar] > div',
    toolInsertRecord: '#toolInsertRecord'
  },
  constants: {
    calendarSectionId: 'DATASHEET_CREATE_CALENDAR_VIEW',
  },
  createView() {
    cy.get(this.elements.addBtn).click();
    if (viewType === ViewType.Calendar) {
      cy.getDomByTestId(this.constants.calendarSectionId).click();
    }
  },
  checkTabLength(num: number) {
    cy.get(this.elements.tabListChildren).should('have.length', num);
  },
  insertRow() {
    cy.get(this.elements.toolInsertRecord).click();
  }
});