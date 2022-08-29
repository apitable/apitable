import { closeDescModal, createDatasheet, deleteNode } from 'cypress/support/common';
import { getRecordUtils } from 'cypress/support/actions/record';
import { PIPE_LINE } from 'cypress/support/config';
import { CELL_ADD_ICON, FIRST_CELL_POSITION } from 'cypress/support/position_constant';

const recordAction = getRecordUtils();

describe('记录的新增和删除', () => {
  before(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();

  });

  const nodeName = 'node record';

  // it('创建节点', function() {
  //   createDatasheet(nodeName);
  // });

  // it('删除记录', () => {
  //   // recordAction.getFirstCell().first().rightclick();
  //   cy.canvasRightClick(...FIRST_CELL_POSITION);
  //   cy.get('.react-contexify__item').last().click();
  //   recordAction.checkRecordLength(2);
  // });

  it('新增记录', function() {
    cy.canvasRightClick(...CELL_ADD_ICON);
    recordAction.checkRecordLength(3);
  });

  // it(`删除 ${nodeName} 节点`, function() {
  //   deleteNode(nodeName);
  // });
});

