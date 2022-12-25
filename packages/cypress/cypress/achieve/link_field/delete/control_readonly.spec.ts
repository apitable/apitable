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

describe('本表可管理', () => {
  beforeEach(() => {
    (async () => {
      await cy.login();
    })();
  });

  it('删除 link C - 可查看', function () {
    deleteLinkField('可查看 C');
  });


});

export const deleteLinkField = (fieldName: string) => {
  cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
  cy.get(`.fieldHeaderClass[data-field-name=${fieldName}]`).rightclick();
  cy.get('#DATASHEET_FIELD_CONTEXT div[role=presentation]').last().click().then(() => {
    expect(cy.get('.ant-modal-body div.footer')).to.be.exist;
  });
  cy.get('.ant-modal-body button.btn-primary').click();
  cy.get(`.fieldHeaderClass[data-field-name]`).should($el => {
    $el.map((index, dom) => {
      expect(dom.innerText).to.not.match(new RegExp(fieldName));
    });
  });
  cy.get('button.undoButton').click().then(() => {
    expect(cy.get(`.fieldHeaderClass[data-field-name=${fieldName}]`)).to.be.exist;
  });
};
