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

import { openSelectLinkModal, openFieldSetting, undo } from "cypress/support/common";

describe('新建一个空白的关联记录', () => {
  beforeEach(() => {
    (async () => {
      await cy.login();
    })();
  });

  // it('没有指定视图', function () {
  //   cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
  //
  //   openSelectLinkModal('可管理 E', 'to.be.exist');
  //   cy.get('.style_linkCard__1VvEv .style_addRecord__3rijO button').eq(0).click();
  //   cy.wait(2000);
  //   cy.get('.style_expandRecord__QT7WV .style_closeButton__1kIQs').eq(0).click();
  //   cy.get('.style_linkCard__1VvEv .style_recordCardWrapper__hscVf').should('to.have.length', 4);
  //   undo();
  //   undo();
  //
  // });

  it('指定的视图存在筛选和分组', function () {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

    openFieldSetting('可管理 E',);

    cy.get('.styles_fieldOperateBox__WB-74 button[role=switch]').eq(1).click();

    cy.wait(100);
    cy.get('.styles_fieldOperateBox__WB-74 .styles_section__2m6OL').eq(4).find('.styles_sectionInfo__17SMY').trigger('mouseover');
    cy.get('.styles_viewSelectItem__3ypwu').eq(1).click();
    cy.get('.styles_fieldOperateBox__WB-74 .btn-primary').eq(0).click();

    openSelectLinkModal('可管理 E', 'to.be.exist');
    cy.get('.style_linkCard__1VvEv .style_empty__1CjVe button').eq(0).click();
    cy.wait(2000);
    cy.get('.style_expandRecord__QT7WV .style_closeButton__1kIQs').eq(0).click();
    cy.get('.style_linkCard__1VvEv .style_recordCardWrapper__hscVf').should('to.have.length', 1);
    undo();
    undo();
    undo();
    openFieldSetting('可管理 E');
    cy.get('.styles_fieldOperateBox__WB-74 button[role=switch]').eq(1).should('to.have.attr', 'aria-checked', 'false');
  });

});
