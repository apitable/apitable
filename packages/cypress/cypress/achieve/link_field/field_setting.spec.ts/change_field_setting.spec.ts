import { changeFieldType, openFieldSetting, hasAtLeastOneClass } from "cypress/support/common";

describe('修改关联列的列配置', () => {
  beforeEach(() => {
    (async () => {
      await cy.login();
    })();
  });

  // it('修改列类型', function () {
  //   cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
  //
  //   openFieldSetting('可管理 E');
  //   changeFieldType('多行文本');
  //
  //   cy.get('.style_viewContainer__R9wa2 .styles_fieldOperateBox__WB-74 button').eq(1).click();
  //   cy.get('.style_funcModal__3d30i button').eq(1).click();
  //
  //   cy.link('可管理 E');
  //
  //   openFieldSetting('可管理 A');
  //
  //   cy.get('.styles_fieldOperateBox__WB-74 #DATASHEET_GRID_CUR_COLUMN_TYPE').should('to.be.not.match', /关联/);
  //   cy.link('可管理 A');
  //   cy.get('.style_toolbarLeft__2p1yP button').eq(0).click();
  // });

  // it('修改关联列的单多选', function () {
  //   cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
  //   openFieldSetting('可管理 E');
  //   const multiSwitch = cy.get('.styles_fieldOperateBox__WB-74 .styles_sectionTitle__3qpQ6 button[role=switch]').eq(0);
  //   multiSwitch.click().then(($el) => {
  //     expect($el[0]).to.have.attr('aria-checked', 'false');
  //   });
  //   multiSwitch.click().then(($el) => {
  //     expect($el[0]).to.have.attr('aria-checked', 'true');
  //   });
  // });

});
