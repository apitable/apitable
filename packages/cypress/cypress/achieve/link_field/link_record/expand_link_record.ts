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
