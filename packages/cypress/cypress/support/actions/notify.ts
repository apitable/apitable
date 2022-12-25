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

export const getNotifyUtils = () => {
  return {
    element: {
      notifyTabItem: '.ant-tabs-tab',
      notificationIcon: '#NAV_ICON_NOTIFICATION',
      activeTabItem: '.ant-tabs-tab.ant-tabs-tab-active',
      expandRecord: '.EXPAND_RECORD',
      unReadItemId: 'rc-tabs-0-tab-unProcessed',
      readItemId: 'rc-tabs-0-tab-processed',
    },
    testId: {
      NOTIFICATION_ITEM_RECORD: 'NOTIFICATION_ITEM_RECORD'
    },
    enterNotify() {
      cy.wait(500).get(this.element.notificationIcon).parent().click();
    },
    enterNotifyList(noRead?: Boolean) {
      if (noRead) {
        cy.wait(300).get(this.element.notifyTabItem).first().click();
        cy.wait(300).get(this.element.activeTabItem).children().should('have.id', this.element.unReadItemId);
      } else {
        cy.wait(300).get(this.element.notifyTabItem).last().click();
        cy.wait(300).get(this.element.activeTabItem).children().should('have.id', this.element.readItemId);
      }
    },
    expandRecord() {
      cy.wait(300).getDomByTestId(this.testId.NOTIFICATION_ITEM_RECORD).first().click();
      cy.get(this.element.expandRecord).should('exist');
    }
  };
};
