import { deleteLinkField } from "cypress/achieve/link_field/delete/control_readonly.spec";

describe('本表可管理', () => {
  beforeEach(() => {
    (async () => {
      await cy.login();
    })();
  });

  it('删除 link D - 不可见', function () {
    deleteLinkField('link_');
  });


});

