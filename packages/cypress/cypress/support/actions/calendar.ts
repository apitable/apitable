
export const calendar = () => ({
  elements: {
    createDateBtn: '.ant-modal-body button',
    notice: '.ant-notification-notice-content',
  },
  constants: {
    secondSuccessNotice: 'Added a new view "Calendar View 2" successfully',
    dateFieldCreateSuccess: 'Add field successfully'
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
