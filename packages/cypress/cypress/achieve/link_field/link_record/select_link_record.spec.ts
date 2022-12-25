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

import { deleteLinkField } from "cypress/achieve/link_field/delete/control_readonly.spec";
import { openSelectLinkModal } from "cypress/support/common";

describe('选择关联记录', () => {
  beforeEach(() => {
    (async () => {
      await cy.login();
    })();
  });

  const checkCanAdd = (path: string, fieldName: string, chainer: string) => {
    cy.open(path);

    openSelectLinkModal(fieldName, chainer).then(() => {
      cy.get('.style_linkCard__1VvEv .style_selectWrapper__23ana').eq(1).click().should('to.be.have', '.style_selected__LL4LI').click();
    });
  };

  const checkNotCanAdd = (path: string, fieldName: string) => {
    cy.open(path);

    cy.get(`.fieldHeaderClass[data-field-name='${fieldName}']`).invoke('attr', 'data-field-id').then(fieldId => {
      cy.get(`.styles_gridCell__3ySbw[data-field-id=${fieldId}]`).eq(0).click();
      cy.get(`.styles_gridCell__3ySbw[data-field-id=${fieldId}]`).should('to.be.not.contain', '.btn-icon');
    });
  };

  describe('可以添加关联记录', function () {

    describe('本表可管理', () => {
      it('关联表可管理', function () {
        checkCanAdd('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '可管理 E', 'to.be.exist');
      });

      it('关联表可编辑', function () {
        checkCanAdd('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '可编辑 B', 'to.be.exist');
      });

      it('关联表可查看', function () {
        checkCanAdd('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '可查看 C', 'to.be.exist');
      });

      it('关联表可编辑', function () {
        checkCanAdd('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '不可见 D', 'to.be.exist');
      });
    });

    describe('本表可编辑', () => {
      it('关联表可管理', function () {
        checkCanAdd('/space/spcfan7hTtnxg/workbench/dstwSUth6wVblDR3HC/viwsCy2XqN0pK', '可管理 A', 'to.be.exist');
      });

      it('关联表可编辑', function () {
        checkCanAdd('/space/spcfan7hTtnxg/workbench/dstwSUth6wVblDR3HC/viwsCy2XqN0pK', '可编辑 B', 'to.be.exist');
      });

      it('关联表可查看', function () {
        checkCanAdd('/space/spcfan7hTtnxg/workbench/dstwSUth6wVblDR3HC/viwsCy2XqN0pK', '可查看 C', 'to.be.exist');
      });

      it('关联表可编辑', function () {
        checkCanAdd('/space/spcfan7hTtnxg/workbench/dstwSUth6wVblDR3HC/viwsCy2XqN0pK', '不可见 D', 'to.be.exist');
      });
    });
  });

  describe('不可以添加关联记录', function () {

    describe('本表可查看', () => {
      it('关联表可管理', function () {
        checkNotCanAdd('/space/spcfan7hTtnxg/workbench/dstzrxGc62ipfGATp9/viwSxzooVub0C', '可管理 A',);
      });

      it('关联表可编辑', function () {
        checkNotCanAdd('/space/spcfan7hTtnxg/workbench/dstzrxGc62ipfGATp9/viwSxzooVub0C', '可编辑 B',);
      });

      it('关联表可查看', function () {
        checkNotCanAdd('/space/spcfan7hTtnxg/workbench/dstzrxGc62ipfGATp9/viwSxzooVub0C', '可查看 C',);
      });

      it('关联表可不可见', function () {
        checkNotCanAdd('/space/spcfan7hTtnxg/workbench/dstzrxGc62ipfGATp9/viwSxzooVub0C', '不可见 D',);
      });
    });
  });
});

