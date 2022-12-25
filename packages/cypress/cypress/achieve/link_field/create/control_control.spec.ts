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

import { deleteField } from 'cypress/support/link_field/common';

describe('This table can be managed, and related tables can be managed', () => {
  beforeEach(() => {

    (async() => {
      await cy.login();
    })();

    // cy.login();
  });

  const newFieldName = '测试创建 可管理-可管理';

  it('This table creates associated columns', function() {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
    cy.get('.operateButton[data-operate-type=addField]').click();
    cy.get('.fieldOperateBox input').type(newFieldName);
    cy.get('#DATASHEET_GRID_CUR_COLUMN_TYPE').trigger('mouseover');
    cy.get('div[data-field-type=7]').click();
    cy.get('.fieldOperateBox .linkTitle').click();
    cy.wait(2000);
    cy.get('.searchPanelContainer .nodeContainer').contains('可管理 E').click();
    cy.get('.fieldOperateBox button.btn-primary').click();
    expect(cy.get(`.fieldHeaderClass[data-field-name='${newFieldName}']`)).to.exist;

  });

  it('Related tables have related columns', function() {
    cy.open('/space/spcfan7hTtnxg/workbench/dst8HJcU0KPW5z5BCy/viwlUBUjYg20r');
    expect(cy.get('.fieldHeaderClass[data-field-name=\'可管理 A\']')).to.exist;
  });

  it('This table deletes the newly created associated columns', function() {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

    deleteField(newFieldName);

    cy.get('.fieldHeaderClass[data-field-name]').each(el => {
      cy.get(el).should('not.have', newFieldName);
    });
  });

  it('The associated columns in the association table are deleted', function() {
    cy.open('/space/spcfan7hTtnxg/workbench/dst8HJcU0KPW5z5BCy/viwlUBUjYg20r');
    cy.get('.fieldHeaderClass[data-field-name]').each(el => {
      cy.get(el).should('not.have', '可管理 A');
    });
  });
});
