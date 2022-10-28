import { closeDescModal, createDatasheet, deleteNode } from 'cypress/support/common';
import { getRecordUtils } from 'cypress/support/actions/record';
import { getNotifyUtils } from 'cypress/support/actions/notify';
import { toolbar, ViewType } from 'cypress/support/toolbar';

const recordAction = getRecordUtils();
const notifyAction = getNotifyUtils();
const toolbarAction = toolbar(ViewType.Vika);

describe('Expand Record Test', () => {
  const nodeName = 'expand record';

  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();
  });

  it(`create ${nodeName} node`, function() {
    createDatasheet(nodeName);
  });

  it('Insert row to expand the card correctly', function() {
    toolbarAction.insertRow();
    recordAction.existExpandRecord(true);
  });

  it('Is the copy link in the expansion card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.copyExpandRecordLink();
  });

  it('Is the deletion in the expansion card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.deleteExpandRecord();
  });

  it('Is the comment in the expansion card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.submitComment();
  });

  it('Is the delete comment in the expansion card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.deleteComment();
  });

  it('Are the unfolding and folding dynamics in the unfolded card correct?', function() {
    recordAction.expandFirstRecord();
    recordAction.expandToggleActivity();
  });

  it('Notification Center expands the card correctly', function() {
    notifyAction.enterNotify();
    notifyAction.enterNotifyList();
    notifyAction.expandRecord();
  });

  it(`delete ${nodeName} node`, function() {
    deleteNode(nodeName);
  });
});
