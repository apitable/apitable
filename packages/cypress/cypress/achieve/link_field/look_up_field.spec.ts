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

import { openFieldSetting } from 'cypress/support/common';

describe('Magical Applications', () => {
  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.open('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

  });

  // describe('是否允许引用关联表 -  当前表可管理', () => {
  //   beforeEach(() => {
  // openFieldSetting('引用 D');
  //     cy.get('.styles_sectionMultiInfo__kF-2T').should('to.be.exist').click();
  //   });
  //
  //   const checkLinkFieldStatus = (fieldName: string, chains: string) => {
  //     cy.get('.styles_panel__3eTQz .styles_optList__-L1qY .styles_fieldItem__3_UwH').contains(fieldName)
  //       .should(chains, 'styles_disabled___6HK7');
  //   };
  //
  //   it('关联表可管理', function () {
  //     cy.get('.styles_panel__3eTQz .styles_optList__-L1qY .styles_fieldItem__3_UwH').contains('可管理 E')
  //       .should('to.not.have', 'styles_disabled___6HK7');
  //     checkLinkFieldStatus('可管理 E', 'to.not.have');
  //   });
  //
  //   it('关联表可编辑', function () {
  //     checkLinkFieldStatus('可编辑 B', 'to.not.have');
  //   });
  //
  //   it('关联表可查看', function () {
  //     checkLinkFieldStatus('可查看 C', 'to.not.have');
  //   });
  //
  //   it('关联表不可见', function () {
  //     checkLinkFieldStatus('不可见 D', 'to.have');
  //   });
  // });

  describe('Whether to allow referenced columns - the current table can be managed', () => {
    beforeEach(() => {

    });

    const checkLinkDstFieldCount = (fieldName: string, chains: string) => {
      openFieldSetting(fieldName);
      cy.get('.styles_section__2m6OL').eq(3).find('.styles_sectionInfo__17SMY').should('to.be.exist').click();
      cy.get('.styles_panel__3eTQz .styles_optList__-L1qY .styles_fieldItem__3_UwH').should(chains,);
    };

    it('Related tables can be managed', function() {

      checkLinkDstFieldCount('引用 E', 'to.be.exist');
    });

    it('The association table can be edited', function() {
      checkLinkDstFieldCount('引用 B', 'to.be.exist');
    });

    it('The association table can be viewed', function() {
      checkLinkDstFieldCount('引用 C', 'to.be.exist');
    });

    it('Association table is not visible', function() {
      checkLinkDstFieldCount('引用 D', 'to.be.not.exist');
    });
  });

  // it('a', function () {
  //   cy.open('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
  //   openFieldSetting('引用 D');
  //
  //   describe('ab', () => {
  //     it('should ', function () {
  //       cy.get('.styles_fieldOperateBox__WB-74');
  //     });
  //   });
  // });
});
