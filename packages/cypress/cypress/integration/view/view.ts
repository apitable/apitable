import { closeDescModal, createDatasheet, deleteNode } from '../../support/common';
import { getViewUtils } from '../../support/actions/view';
import { PIPE_LINE } from 'cypress/support/config';

const viewAction = getViewUtils();

describe('测试新增视图和删除视图', () => {

  describe('视图工具栏', () => {

    const nodeName = 'test view';

    beforeEach(() => {
      (async() => {
        await cy.login();
      })();
      cy.link('/workbench');
      closeDescModal();
    });

    it('新建节点', function() {
      createDatasheet(nodeName);
    });

    it('新增表格视图', function() {
      viewAction.addView(viewAction.gridView);
      viewAction.assertViewCount(2);
    });

    // it('新增相册视图', function() {
    //   cy.get('body').click();
    //   viewAction.addView(viewAction.galleryView);
    //   viewAction.assertViewCount(2);
    // });

    it('新增看板视图', function() {
      viewAction.addView(viewAction.kanbanView);
      viewAction.assertViewCount(3);
    });

    it('新增甘特图', function() {
      viewAction.addView(viewAction.gattView);
      viewAction.assertViewCount(4);
    });

    // it('视图数量不超过三十个', () => {
    //   for (let i = 4; i < 31; i++) {
    //     viewAction.addView(viewAction.gridView);
    //     cy.get('body').click();
    //   }
    //   viewAction.assertViewCount(30);
    // });

    it(`删除 ${nodeName} 节点`, function() {
      deleteNode(nodeName);
    });
  });

  describe('视图列表', () => {

    const nodeName = 'test view';

    beforeEach(() => {
      (async() => {
        await cy.login();
      })();
      cy.visit(`/workbench?pipeline=${PIPE_LINE}`).wait(2000);
      closeDescModal();

    });

    it('should ', function() {
      createDatasheet(nodeName);
    });

    it('新增视图', function() {
      viewAction.getShowViewListButton().click();
      cy.getDomByTestId('DATASHEET_CREATE_GRID_IN_VIEW_LIST').click();
      cy.get('[data-rbd-droppable-id=view-switcher]').click();
      cy.get('[data-rbd-droppable-id=view-switcher]>div').should('have.length', 2);
    });

    it('删除视图', function() {
      viewAction.getShowViewListButton().click();
      cy.get('[data-rbd-draggable-context-id=0]').eq(1).trigger('mouseover');
      cy.get('[data-test-id=deleteViewIcon]').eq(1).click();
      cy.get('.ant-modal-root button').eq(1).click();
      viewAction.getShowViewListButton().click();
      cy.get('[data-rbd-droppable-id=view-switcher]>div').should('have.length', 1);
    });

    it('视图重命名', function() {
      viewAction.getShowViewListButton().click();
      cy.get('[data-rbd-droppable-id=view-switcher] > div').first().trigger('mouseover');
      cy.get('[data-test-id=renameViewIcon]').click();
      cy.focused().clear().type(nodeName);
      cy.get('[data-rbd-droppable-id=view-switcher]').click();
      cy.get('[data-rbd-droppable-id=view-switcher]>div').contains(nodeName).should('exist');
    });

    it(`删除 ${nodeName} 节点`, function() {
      deleteNode(nodeName);
    });
  });

});
