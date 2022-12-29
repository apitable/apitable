export enum ViewType {
  Calendar = 'calendar',
  Vika = 'vika'
}

export const toolbar = (viewType: ViewType) => ({
  elements: {
    addBtn: '#DATASHEET_ADD_VIEW_BTN',
    tabList: '[data-test-id=tabList]',
    tabListChildren: '[data-rbd-droppable-id=view-bar] > div',
    toolInsertRecord: '#toolInsertRecord'
  },
  constants: {
    calendarSectionId: 'DATASHEET_CREATE_CALENDAR_VIEW',
  },
  createView() {
    cy.get(this.elements.addBtn).click();
    if (viewType === ViewType.Calendar) {
      cy.getDomByTestId(this.constants.calendarSectionId).click();
    }
  },
  checkTabLength(num: number) {
    cy.get(this.elements.tabListChildren).should('have.length', num);
  },
  insertRow() {
    cy.get(this.elements.toolInsertRecord).click();
  }
});