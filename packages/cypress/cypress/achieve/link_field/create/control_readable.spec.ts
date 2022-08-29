describe('本表可管理，关联表可查看', () => {
  beforeEach(() => {

    (async () => {
      await cy.login();
    })();

    // cy.login();
  });

  const newFieldName = '测试创建 可管理-可查看';

  it('本表创建关联列', function () {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
    cy.get('.operateButton[data-operate-type=addField]').click();
    cy.get('.fieldOperateBox input').type(newFieldName);
    cy.get('#DATASHEET_GRID_CUR_COLUMN_TYPE').trigger('mouseover');
    cy.get('div[data-field-type=7]').click();
    cy.get('.fieldOperateBox .linkTitle').click();
    cy.wait(2000);
    cy.get('.searchPanelContainer .nodeContainer').contains('可查看 C').should($el => {
      $el.map((index, dom) => {
        const classNames = dom.parentElement!.className;
        expect(classNames).to.match(/disable/);
      });
    });
  });
});
