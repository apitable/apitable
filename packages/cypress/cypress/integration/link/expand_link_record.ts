import { closeDescModal } from 'cypress/support/common';
import { getRecordUtils } from 'cypress/support/actions/record';

const recordAction = getRecordUtils();

describe('测试展开关联记录', () => {
  describe('只有关联表的可读权限，展开关联记录的操作选项里不应该显示删除按钮', () => {
    beforeEach(() => {
      (async() => {
        await cy.login('viceAccount');
      })();

      cy.link('/workbench/dst44uPc6pmp7GjVYZ/viw84T0Tfc66p');
      closeDescModal();
    });

    it('展开只读权限的关联记录，没有删除记录的入口', function() {
      recordAction.expandExactLinkRecord();
      recordAction.unVisibleDeleteRecordOption();
    });

    it('关联表展开卡片跳转去源表正确', function() {
      recordAction.expandExactLinkRecord();
      recordAction.gotoSourceDst();
    });
  });

});
