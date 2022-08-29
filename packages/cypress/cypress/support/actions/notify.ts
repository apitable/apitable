export const getNotifyUtils = () => {
  return {
    element: {
      notifyTabItem: '.ant-tabs-tab',
      notificationIcon: '#NAV_ICON_NOTIFICATION',
      activeTabItem: '.ant-tabs-tab.ant-tabs-tab-active',
      expandRecord: '.EXPAND_RECORD',
      unReadItemId: 'rc-tabs-0-tab-unProcessed',
      readItemId: 'rc-tabs-0-tab-processed',
    },
    testId: {
      NOTIFICATION_ITEM_RECORD: 'NOTIFICATION_ITEM_RECORD'
    },
    enterNotify() {
      cy.wait(500).get(this.element.notificationIcon).parent().click();
    },
    enterNotifyList(noRead?: Boolean) {
      if (noRead) {
        cy.wait(300).get(this.element.notifyTabItem).first().click();
        cy.wait(300).get(this.element.activeTabItem).children().should('have.id', this.element.unReadItemId);
      } else {
        cy.wait(300).get(this.element.notifyTabItem).last().click();
        cy.wait(300).get(this.element.activeTabItem).children().should('have.id', this.element.readItemId);
      }
    },
    expandRecord() {
      cy.wait(300).getDomByTestId(this.testId.NOTIFICATION_ITEM_RECORD).first().click();
      cy.get(this.element.expandRecord).should('exist');
    }
  };
};
