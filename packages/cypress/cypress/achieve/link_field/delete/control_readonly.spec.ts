describe('本表可管理', () => {
  beforeEach(() => {
    (async () => {
      await cy.login();
    })();
  });

  it('删除 link C - 可查看', function () {
    deleteLinkField('可查看 C');
  });


});

export const deleteLinkField = (fieldName: string) => {
  cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
  cy.get(`.fieldHeaderClass[data-field-name=${fieldName}]`).rightclick();
  cy.get('#DATASHEET_FIELD_CONTEXT div[role=presentation]').last().click().then(() => {
    expect(cy.get('.ant-modal-body div.footer')).to.be.exist;
  });
  cy.get('.ant-modal-body button.btn-primary').click();
  cy.get(`.fieldHeaderClass[data-field-name]`).should($el => {
    $el.map((index, dom) => {
      expect(dom.innerText).to.not.match(new RegExp(fieldName));
    });
  });
  cy.get('button.undoButton').click().then(() => {
    expect(cy.get(`.fieldHeaderClass[data-field-name=${fieldName}]`)).to.be.exist;
  });
};
