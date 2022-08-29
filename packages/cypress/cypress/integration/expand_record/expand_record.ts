import { closeDescModal, createDatasheet, deleteNode } from 'cypress/support/common';
import { getRecordUtils } from 'cypress/support/actions/record';
import { getNotifyUtils } from 'cypress/support/actions/notify';
import { toolbar, ViewType } from 'cypress/support/toolbar';

const recordAction = getRecordUtils();
const notifyAction = getNotifyUtils();
const toolbarAction = toolbar(ViewType.Vika);

describe('展开记录测试', () => {
  const nodeName = 'expand record';

  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();
  });

  it(`创建 ${nodeName} 节点`, function() {
    createDatasheet(nodeName);
  });

  it('插入行展开卡片是否正确', function() {
    toolbarAction.insertRow();
    recordAction.existExpandRecord(true);
  });

  it('展开卡片中的复制链接是否正确', function() {
    recordAction.expandFirstRecord();
    recordAction.copyExpandRecordLink();
  });

  it('展开卡片中的删除是否正确', function() {
    recordAction.expandFirstRecord();
    recordAction.deleteExpandRecord();
  });

  it('展开卡片中的评论是否正确', function() {
    recordAction.expandFirstRecord();
    recordAction.submitComment();
  });

  it('展开卡片中的删除评论是否正确', function() {
    recordAction.expandFirstRecord();
    recordAction.deleteComment();
  });

  it('展开卡片中的展开折叠动态是否正确', function() {
    recordAction.expandFirstRecord();
    recordAction.expandToggleActivity();
  });

  it('通知中心展开卡片是否正确', function() {
    notifyAction.enterNotify();
    notifyAction.enterNotifyList();
    notifyAction.expandRecord();
  });

  it(`删除 ${nodeName} 节点`, function() {
    deleteNode(nodeName);
  });
});
