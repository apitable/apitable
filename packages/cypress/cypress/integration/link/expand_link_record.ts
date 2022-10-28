import { closeDescModal } from 'cypress/support/common';
import { getRecordUtils } from 'cypress/support/actions/record';

const recordAction = getRecordUtils();

describe('Test unfolding association records', () => {
  describe('Only the read access to the associated table, the delete button should not be displayed in the action option of expanding the associated record', () => {
    beforeEach(() => {
      (async() => {
        await cy.login('viceAccount');
      })();

      cy.link('/workbench/dst44uPc6pmp7GjVYZ/viw84T0Tfc66p');
      closeDescModal();
    });

    it('Expand read-only permissions for associated records, no entry to delete records', function() {
      recordAction.expandExactLinkRecord();
      recordAction.unVisibleDeleteRecordOption();
    });

    it('Related tables expand the card to jump to the source table correctly', function() {
      recordAction.expandExactLinkRecord();
      recordAction.gotoSourceDst();
    });
  });

});
