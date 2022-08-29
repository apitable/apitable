import { deleteField } from "cypress/support/link_field/common";

describe('本表可管理，关联表可管理', () => {
  beforeEach(() => {

    (async () => {
      await cy.login();
    })();

    // cy.login();
  });

  const newFieldName = '测试创建 可管理-可管理';

  it('本表创建关联列', function () {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
    cy.get('.operateButton[data-operate-type=addField]').click();
    cy.get('.fieldOperateBox input').type(newFieldName);
    cy.get('#DATASHEET_GRID_CUR_COLUMN_TYPE').trigger('mouseover');
    cy.get('div[data-field-type=7]').click();
    cy.get('.fieldOperateBox .linkTitle').click();
    cy.wait(2000);
    cy.get('.searchPanelContainer .nodeContainer').contains('可管理 E').click();
    cy.get('.fieldOperateBox button.btn-primary').click();
    expect(cy.get(`.fieldHeaderClass[data-field-name='${newFieldName}']`)).to.exist;

  });

  it('关联表存在关联列', function () {
    cy.open('/space/spcfan7hTtnxg/workbench/dst8HJcU0KPW5z5BCy/viwlUBUjYg20r');
    expect(cy.get(`.fieldHeaderClass[data-field-name='可管理 A']`)).to.exist;
  });

  it('本表删除新创建的关联列', function () {
    cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');

    deleteField(newFieldName);

    cy.get(`.fieldHeaderClass[data-field-name]`).each(el => {
      cy.get(el).should('not.have', newFieldName);
    });
  });

  it('关联表存的关联列被删除', function () {
    cy.open('/space/spcfan7hTtnxg/workbench/dst8HJcU0KPW5z5BCy/viwlUBUjYg20r');
    cy.get(`.fieldHeaderClass[data-field-name]`).each(el => {
      cy.get(el).should('not.have', '可管理 A');
    });
  });
});
