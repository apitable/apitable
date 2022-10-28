import { closeDescModal, closeVideoModal, createDatasheet, deleteNode } from 'cypress/support/common';
import { toolbar, ViewType } from 'cypress/support/toolbar';
import { calendar } from 'cypress/support/actions/calendar';

const CALENDAR_NAME = 'Calendar_View_Testing';

const toolbarAction = toolbar(ViewType.Calendar);
const calendarAction = calendar();

describe('Record Calendar View', () => {
  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench');
    closeDescModal();
  });

  it(`create ${CALENDAR_NAME}`, () => {
    createDatasheet(CALENDAR_NAME);
  });

  it('Create calendar view (no date column)', () => {
    toolbarAction.createView();
    closeVideoModal();
    calendarAction.createDate();
    toolbarAction.checkTabLength(2);
  });

  it('Create a calendar view (with date columns)', () => {
    toolbarAction.createView();
    toolbarAction.checkTabLength(3);
  });

  it(`delete ${CALENDAR_NAME}`, function() {
    deleteNode(CALENDAR_NAME);
  });
});
