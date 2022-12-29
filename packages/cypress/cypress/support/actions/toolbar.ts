export const toolbarUtils = () => {
  return {
    testId: {
      DATASHEET_API_BTN: 'DATASHEET_API_BTN',
      DATASHEET_ROBOT_BTN: 'DATASHEET_ROBOT_BTN',
    },
    toggleApiPanel() {
      cy.wait(300).getDomByTestId(this.testId.DATASHEET_API_BTN).click();
    },
    toggleRobotPanel() {
      cy.wait(300).getDomByTestId(this.testId.DATASHEET_ROBOT_BTN).click();
    },
  };
};