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

/**
 * @description Open the right-click menu that matches the column name
 * @param {string} fieldName
 */
import Chainable = Cypress.Chainable;

export const openFieldMenu = (fieldName: string) => {
  cy.get(`.fieldHeaderClass[data-field-name='${fieldName}']`).rightclick();
};

export const deleteField = (fieldName: string) => {
  openFieldMenu(fieldName);
  cy.get('#DATASHEET_FIELD_CONTEXT div[role=presentation]').last().click();
  cy.get('.ant-modal-body button[role=switch]').click();
  cy.get('.ant-modal-body  .styles_text__tfBof').contains('删除列').click();
  return cy.get('.ant-modal-body button.btn-primary').click();
};

export const openSelectLinkModal = (fieldName: string, chainer: string) => {
  return cy.get(`.fieldHeaderClass[data-field-name='${fieldName}']`).invoke('attr', 'data-field-id').then(fieldId => {
    cy.get(`.styles_gridCell__3ySbw[data-field-id=${fieldId}]`).eq(0).click();
    const addIcon = cy.get(`.styles_gridCell__3ySbw[data-field-id=${fieldId}] .btn-icon`);
    addIcon.should(chainer);
    addIcon.click();
  });
};

export const openFieldSetting = (fieldName: string) => {
  cy.get(`.fieldHeaderClass[data-field-name='${fieldName}']`).should('to.be.exist').dblclick();
};

export const changeFieldType = (typeName: string) => {
  cy.get('#DATASHEET_GRID_CUR_COLUMN_TYPE').trigger('mouseover');
  // cy.get(`div[data-field-type=${fieldType}]`).click();
  cy.get('.styles_typeSelectItem__RCkf6').contains(typeName).click();
};

// Check if a class name exists on dom
export const hasAtLeastOneClass = (expectedClasses: string[]) => {
  return ($el: any) => {
    const classList = Array.from($el[0].classList);
    return expectedClasses.some(expectedClass => classList.includes(expectedClass));
  };
};

export const undo = () => {
  cy.get('[data-test-id=undo]').click({ force: true });
};

export const findFirstCellByFieldName = (fieldName: string, cb: (dom: Chainable<JQuery<HTMLElement>>) => void) => {
  return cy.get(`.fieldHeaderClass[data-field-name='${fieldName}']`).invoke('attr', 'data-field-id').then(fieldId => {
    cb(cy.get(`.styles_gridCell__3ySbw[data-field-id=${fieldId}]`).eq(0));
  });
};

export const createDatasheet = (dstName: string) => {
  cy.get('#WORKBENCH_SIDE_ADD_NODE_BTN').click().wait(500);
  cy.get('#NODE_CONTEXT_MENU_ID').wait(200).find('[role="menuitem"]').eq(0).click().wait(1000);

  closeDescModal(
    () => {
      renameNode(dstName);
    },
    () => {
      cy.focused().clear().type(dstName).blur();
    },
  );
};

export const renameNode = (nodeName: string) => {
  cy.wait(1000).get('.ant-collapse > .ant-collapse-item:nth-child(2) ul > li:first-child').rightclick();
  cy.get('.react-contexify__item').first().click();
  cy.focused().clear().type(nodeName).blur();
};

export const deleteNode = (nodeName: string) => {
  cy.wait(1000).get('.ant-collapse > .ant-collapse-item:nth-child(2) ul > li').contains(nodeName).rightclick();
  cy.get('#NODE_CONTEXT_MENU_ID').wait(200).find('[role="menuitem"]').last().click();
  cy.get('.ant-popover .ant-space-item').last().click();
};

export const closeDescModal = (trueCb?: Function, falseCb?: Function) => {
  cy.get('body').then($body => {
    if ($body.find('.ant-modal-content button[aria-label=Close]').length > 0) {
      cy.get('.ant-modal-content button[aria-label=Close]').click();
      trueCb && trueCb();
    } else {
      falseCb && falseCb();
    }
  });
};

export const closeVideoModal = () => {
  cy.get('body').then($body => {
    if ($body.find('video').length > 0) {
      cy.get('vika-guide-modal-close').eq(0).click();
    }
  });
};
