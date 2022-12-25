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

import { findFirstCellByFieldName } from "cypress/support/common";

describe('展开关联记录', () => {
  beforeEach(() => {
    (async () => {
      await cy.login();
    })();
  });

  describe('站内 - 当前表可管理', function () {
    it('关联表可管理', function () {
      cy.open('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

      findFirstCellByFieldName('可管理 E', (dom) => {
        dom.find('.style_tabItem__37BhK').eq(0).click({ force: true });
        cy.get('.style_expandRecord__QT7WV').should('to.be.exist');
      });
    });

    it('关联表可编辑', function () {
      cy.open('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

      findFirstCellByFieldName('可编辑 B', (dom) => {
        dom.find('.style_tabItem__37BhK').eq(0).click({ force: true });
        cy.get('.style_expandRecord__QT7WV').should('to.be.exist');
      });
    });

    it('关联表可查看', function () {
      cy.open('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

      findFirstCellByFieldName('可查看 C', (dom) => {
        dom.find('.style_tabItem__37BhK').eq(0).click({ force: true });
        cy.get('.style_expandRecord__QT7WV').should('to.be.exist');
      });
    });

    it('关联表不可见', function () {
      cy.open('space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

      findFirstCellByFieldName('不可见 D', (dom) => {
        dom.find('.style_tabItem__37BhK').eq(0).click({ force: true });
        cy.wait(200);
        cy.get('.style_expandRecord__QT7WV').should('to.be.not.exist');
      });
    });
  });

  describe('访问单独分享的表', () => {
    it('关联表可管理', function () {
      cy.open('share/shrUNWCQYLTP9hNpd8d2A/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
      findFirstCellByFieldName('可管理 E', (dom) => {
        dom.find('.style_tabItem__37BhK').eq(0).click({ force: true });
        cy.get('.style_expandRecord__QT7WV').should('to.be.not.exist');
      });
    });
  });

  describe('访问分享文件夹内的关联表', () => {
    it('关联表可管理', function () {
      cy.open('share/shrbBAdZhSS0UfgjcQkcw/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
      findFirstCellByFieldName('可管理 E', (dom) => {
        dom.find('.style_tabItem__37BhK').eq(0).click({ force: true });
        cy.get('.style_expandRecord__QT7WV').should('to.be.exist');
      });
    });
  });

  describe('站内访问手机表', () => {
    it('关联表可管理', function () {
      // cy.open('space/spcfan7hTtnxg/workbench/fomdYApyzcMVrmsLPt');
      // findFirstCellByFieldName('可管理 E', (dom) => {
      //   dom.find('.style_tabItem__37BhK').eq(0).click({ force: true });
      //   cy.get('.style_expandRecord__QT7WV').should('to.be.exist');
      // });
    });
  });
});
