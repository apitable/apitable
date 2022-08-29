import { closeDescModal, closeVideoModal, createDatasheet, deleteNode } from 'cypress/support/common';
import { toolbar, ViewType } from 'cypress/support/toolbar';
import { calendar } from 'cypress/support/actions/calendar';

const CALENDAR_NAME = 'Calendar_View_Testing';

const toolbarAction = toolbar(ViewType.Calendar);
const calendarAction = calendar();

describe('记录日历视图', () => {
  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();
  });

  it(`创建 ${CALENDAR_NAME} 表`, () => {
    createDatasheet(CALENDAR_NAME);
  });

  it('创建日历视图（无日期列）', () => {
    toolbarAction.createView();
    closeVideoModal();
    calendarAction.createDate();
    toolbarAction.checkTabLength(2);
  });

  it('创建日历视图（有日期列）', () => {
    toolbarAction.createView();
    toolbarAction.checkTabLength(3);
  });

  it(`删除 ${CALENDAR_NAME} 表`, function() {
    deleteNode(CALENDAR_NAME);
  });
});
