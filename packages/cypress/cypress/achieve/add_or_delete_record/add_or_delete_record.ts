import { closeDescModal, createDatasheet, deleteNode } from 'cypress/support/common';
import { getRecordUtils } from 'cypress/support/actions/record';
import { PIPE_LINE } from 'cypress/support/config';
import { CELL_ADD_ICON, FIRST_CELL_POSITION } from 'cypress/support/position_constant';

const recordAction = getRecordUtils();

describe('Addition and deletion of records', () => {
  before(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();

  });

  const nodeName = 'node record';

  // it('Create Node', function() {
  //   createDatasheet(nodeName);
  // });

  // it('Delete records', () => {
  //   // recordAction.getFirstCell().first().rightclick();
  //   cy.canvasRightClick(...FIRST_CELL_POSITION);
  //   cy.get('.react-contexify__item').last().click();
  //   recordAction.checkRecordLength(2);
  // });

  it('New records', function() {
    cy.canvasRightClick(...CELL_ADD_ICON);
    recordAction.checkRecordLength(3);
  });

  // it(`delete ${nodeName} node`, function() {
  //   deleteNode(nodeName);
  // });
});

