export const getViewUtils = () => {
  return {
    gattView: 'DATASHEET_CREATE_GANTT_VIEW',
    gridView: 'DATASHEET_CREATE_GRID_VIEW',
    galleryView: 'DATASHEET_CREATE_GALLERY_VIEW',
    kanbanView: 'DATASHEET_CREATE_KANBAN_VIEW',
    getShowViewListButton() {
      return cy.get('[data-test-id=DATASHEET_SHOW_VIEW_LIST_BTN]');
    },
    addViewElement: () => {
      return cy.wait(100).get('#DATASHEET_ADD_VIEW_BTN');
    },

    assertViewCount(count: number) {
      cy.get('[data-test-id=viewTab]').should('have.length', count);
    },

    addViewButton() {
      return cy.get('#DATASHEET_ADD_VIEW_BTN');
    },

    addView(typeName: string) {
      this.addViewElement().click();
      return cy.wait(200).get(`[data-test-id=${typeName}]`).click();
    },
  };
};
