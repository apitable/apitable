
export const calendar = () => ({
  elements: {
    createDateBtn: '.ant-modal-body button',
    notice: '.ant-notification-notice-content',
  },
  constants: {
    secondSuccessNotice: '新增视图「日历视图 2」成功',
    dateFieldCreateSuccess: '添加维格列成功'
  },
  createDate() {
    cy.get(this.elements.createDateBtn).click();
  },
  createSecondViewSuccess() {
    cy.get(this.elements.notice).contains(this.constants.secondSuccessNotice);
  },
  createDateFieldSuccess() {
    cy.get(this.elements.notice).contains(this.constants.dateFieldCreateSuccess);
  }
});