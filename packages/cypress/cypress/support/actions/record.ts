import urlcat from 'urlcat';
import { FIRST_CELL_POSITION, FIRST_RECORD_EXPAND_ICON } from 'cypress/support/position_constant';

export const getRecordUtils = () => {
  return {
    element: {
      operateList: '.rc-trigger-popup',
      notice: '.ant-notification-notice.ant-notification-notice-closable',
      expandRecord: '.EXPAND_RECORD',
      commentMenu: '#COMMENT_MENU'
    },
    testId: {
      // 展开记录的二级操作入口按钮
      EXPAND_RECORD_OPERATE_BUTTON: 'EXPAND_RECORD_OPERATE_BUTTON',
      EXPAND_RECORD_OPERATE_COPY_LINK: 'EXPAND_RECORD_OPERATE_COPY_LINK',
      EXPAND_RECORD_DELETE_RECORD: 'EXPAND_RECORD_DELETE_RECORD',
      EXPAND_RECORD_COMMENT_WRAPPER: 'EXPAND_RECORD_COMMENT_WRAPPER',
      COMMENT_SUBMIT_BUTTON: 'COMMENT_SUBMIT_BUTTON',
      EXPAND_RECORD_ACTIVITY_ITEM: 'EXPAND_RECORD_ACTIVITY_ITEM',
      EXPAND_RECORD_TOGGLE_ACTIVITY_BUTTON: 'EXPAND_RECORD_TOGGLE_ACTIVITY_BUTTON',
      EXPAND_RECORD_DELETE_COMMENT_MORE: 'EXPAND_RECORD_DELETE_COMMENT_MORE',
      EXPAND_RECORD_GOTO_SOURCE_DST_ICON: 'EXPAND_RECORD_GOTO_SOURCE_DST_ICON',
      EXPAND_RECORD_FROM_LINK_NAME: 'EXPAND_RECORD_FROM_LINK_NAME',
      MODAL_FOOTER_BTN_CONFIRM: 'MODAL_FOOTER_BTN_CONFIRM'
    },
    constants: {},
    positionConstants: {
      exactLinkRecord: [353, 53],
    },
    getFirstCell() {
      return cy.get('[data-test-id=cell-0-0]').first();
    },
    getAddCell() {
      return cy.get('[data-test-id=addRecord]').first();
    },
    existExpandRecord(exist: boolean) {
      cy.get(this.element.expandRecord).should(exist ? 'exist' : 'not.exist');
    },
    checkRecordLength(count: number) {
      cy.get('#gridViews').children('div').eq(2).find('div.operateHeadClass', {
        timeout: 5000,
      }).should('have.length', count);
    },
    expandFirstRecord() {
      cy.canvasClick(...FIRST_CELL_POSITION);
      cy.canvasClick(...FIRST_RECORD_EXPAND_ICON);
    },
    copyExpandRecordLink() {
      cy.getDomByTestId(this.testId.EXPAND_RECORD_OPERATE_BUTTON).click();
      cy.getDomByTestId(this.testId.EXPAND_RECORD_OPERATE_COPY_LINK).wait(200).click({ log: true });

      cy.location().then((loc) => {
        cy.get('#CLIPBOARD_INPUT').invoke('val').should(val => {
          expect(urlcat(loc.origin, loc.pathname)).to.eq(val);
        });
      });
    },
    deleteExpandRecord() {
      cy.getDomByTestId(this.testId.EXPAND_RECORD_OPERATE_BUTTON).click();
      cy.getDomByTestId(this.testId.EXPAND_RECORD_DELETE_RECORD).wait(200).click();
      cy.get(this.element.notice).wait(300).should('exist');
      // 删除之后卡片是否正常关闭
      cy.get(this.element.expandRecord).should('not.exist');
    },
    submitComment() {
      const preActivityLen = document.querySelectorAll(`[data-test-id=${this.testId.EXPAND_RECORD_ACTIVITY_ITEM}]`).length;
      cy.getDomByTestId(this.testId.EXPAND_RECORD_COMMENT_WRAPPER).click().wait(200).focused().type('test comment');
      cy.getDomByTestId(this.testId.COMMENT_SUBMIT_BUTTON).click();
      cy.wait(200).getDomByTestId(this.testId.EXPAND_RECORD_ACTIVITY_ITEM).should('have.length', preActivityLen + 1);
    },
    deleteComment() {
      cy.wait(400).document().then(document => {
        const hasExpandActivity = Boolean(document.querySelectorAll(`[data-test-id=${this.testId.EXPAND_RECORD_COMMENT_WRAPPER}]`).length);
        const preActivityLen = document.querySelectorAll(`[data-test-id=${this.testId.EXPAND_RECORD_ACTIVITY_ITEM}]`).length;
        const hasComment = Boolean(preActivityLen);
        if (!hasExpandActivity) {
          this.expandToggleActivity();
        }
        if (!hasComment) {
          this.submitComment();
        }
        cy.getDomByTestId(this.testId.EXPAND_RECORD_DELETE_COMMENT_MORE).first().click();
        cy.wait(300).get(this.element.commentMenu).first().click();
        cy.wait(500).getDomByTestId(this.testId.MODAL_FOOTER_BTN_CONFIRM).wait(300).click();
        cy.wait(300).getDomByTestId(this.testId.EXPAND_RECORD_ACTIVITY_ITEM).should('have.length', preActivityLen ? 0 : preActivityLen - 1);
      });
    },
    expandToggleActivity() {
      cy.getDomByTestId(this.testId.EXPAND_RECORD_TOGGLE_ACTIVITY_BUTTON).click();
      cy.getDomByTestId(this.testId.EXPAND_RECORD_COMMENT_WRAPPER).should('not.exist');
      cy.getDomByTestId(this.testId.EXPAND_RECORD_TOGGLE_ACTIVITY_BUTTON).click();
      cy.getDomByTestId(this.testId.EXPAND_RECORD_COMMENT_WRAPPER).should('exist');
    },
    expandExactLinkRecord() {
      // 第一次点击用来激活单元格
      cy.canvasClick(...this.positionConstants.exactLinkRecord as [number, number]);
      // 第二次点击展开卡片
      cy.canvasClick(...this.positionConstants.exactLinkRecord as [number, number]);
    },
    unVisibleDeleteRecordOption() {
      cy.getDomByTestId(this.testId.EXPAND_RECORD_OPERATE_BUTTON).click();
      cy.getDomByTestId(this.testId.EXPAND_RECORD_DELETE_RECORD).should('not.exist');
    },
    gotoSourceDst() {
      cy.location().then(location => {
        const curPathname = location.pathname;
        cy.getDomByTestId(this.testId.EXPAND_RECORD_GOTO_SOURCE_DST_ICON).click();
        cy.location().should(location => expect(location.hostname).to.not.eq(curPathname));
      });
    }
  };
};
