export const sidebarUtils = () => {
  return {
    testId: {
      SIDEBAR_TOGGLE_BTN: 'sidebar-toggle-btn',
      SIDEBAR_MENU: 'workspace-sidebar',
    },
    toggleSideBar() {
      cy.getDomByTestId(this.testId.SIDEBAR_TOGGLE_BTN).click();
    },
    assertSideBar(visible: boolean) {
      const str = visible ? '335px' : '0px';
      cy.getDomByTestId(this.testId.SIDEBAR_MENU).should('have.css', 'width', str);
    },
  };
};