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

import { openSelectLinkModal } from "cypress/support/common";

describe('选择关联记录 modal 的展示', () => {

  const onlyShowFirstColumn = (path: string, fieldName: string, chainer: string = 'to.be.exist') => {
    cy.open(path);

    openSelectLinkModal(fieldName, chainer);

    return cy.get('.style_selectWrapper__23ana').eq(0).get('.style_cellRow__1Iho0');
  };

  const openFormSelectLinkModal = (path: string, fieldName: string) => {
    cy.open(path, false);
    cy.wait(1000);
    cy.get('.style_formFieldUI__wrgrh').contains(fieldName).parent('.style_formFieldUI__wrgrh').find('button').click();

    return cy.get('.style_selectWrapper__23ana').eq(0).get('.style_cellRow__1Iho0');
  };

  describe('站内访问关联表', () => {

    beforeEach(() => {
      (async () => {
        await cy.login();
      })();
    });

    it('当前表 - 可管理，关联表 - 可管理', function () {
      onlyShowFirstColumn('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '可管理 E').should('to.be.exist');
    });

    it('当前表 - 可管理，关联表 - 可编辑', function () {
      onlyShowFirstColumn('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '可编辑 B').should('to.be.exist');
    });

    it('当前表 - 可管理，关联表 - 可查看', function () {
      onlyShowFirstColumn('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '可查看 C').should('to.be.exist');
    });

    it('当前表 - 可管理，关联表 - 禁止访问', function () {
      onlyShowFirstColumn('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '不可见 D').should('to.be.not.exist');
    });
  });

  describe('访问分享的关联表（仅单张表）', () => {
    it('登录用户', function () {
      cy.login().then(() => {
        onlyShowFirstColumn('share/shrUNWCQYLTP9hNpd8d2A/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '可管理 E').should('to.be.not.exist');
      });
    });
  });

  describe('访问分享的文件夹', () => {
    it('登录用户', function () {
      cy.login().then(() => {
        onlyShowFirstColumn('share/shrbBAdZhSS0UfgjcQkcw/dstCiLHpaWejq46PcY/viwCCmpN4f5MU', '可管理 E').should('to.be.exist');
      });
    });
  });

  describe('站内访问可管理收集表', () => {
    beforeEach(() => {
      (async () => {
        await cy.login();
      })();
    });


    it('关联表 - 可管理', function () {
      cy.login().then(() => {
        openFormSelectLinkModal('space/spcfan7hTtnxg/workbench/fomYYD7mftq2H0jd40', '可管理 E').should('to.be.exist');
      });
    });

    it('关联表 - 可编辑', function () {
      cy.login().then(() => {
        openFormSelectLinkModal('space/spcfan7hTtnxg/workbench/fomYYD7mftq2H0jd40', '可编辑 B').should('to.be.exist');
      });
    });

    it('关联表 - 可查看', function () {
      cy.login().then(() => {
        openFormSelectLinkModal('space/spcfan7hTtnxg/workbench/fomYYD7mftq2H0jd40', '可查看 C').should('to.be.exist');
      });
    });

    it('关联表 - 不可见', function () {
      cy.login().then(() => {
        openFormSelectLinkModal('space/spcfan7hTtnxg/workbench/fomYYD7mftq2H0jd40', '不可见 D').should('to.be.not.exist');
      });
    });
  });

  describe('站外访问收集表', () => {
    beforeEach(() => {
      (async () => {
        await cy.login();
      })();
    });

    it('匿名', function () {
      openFormSelectLinkModal('share/shr7fQBjJ7w0LZdZth9YY/fomYYD7mftq2H0jd40', '可管理 E').should('to.be.not.exist');
    });

    it('实名', function () {
      cy.login().then(() => {
        openFormSelectLinkModal('share/shr8HeuFF48xRZ2yvxGHr/fomdYApyzcMVrmsLPt', '可管理 E').should('to.be.not.exist');
      });
    });
  });
});

