import { closeDescModal } from 'cypress/support/common';
import { sidebarUtils } from 'cypress/support/actions/sidebar';
import { toolbarUtils } from 'cypress/support/actions/toolbar';

const sidebarActions = sidebarUtils();
const toolbarActions = toolbarUtils();

describe('目录树与右侧面板', () => {
  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench/dst44uPc6pmp7GjVYZ/viw84T0Tfc66p');
    closeDescModal();
  });

  it ('打开机器人面板，目录树保持展开', function() {
    toolbarActions.toggleRobotPanel();
    sidebarActions.assertSideBar(true);
  });
  
  it ('连续切换 api 面板，目录树展开', function() {
    toolbarActions.toggleApiPanel();
    toolbarActions.toggleApiPanel();
    sidebarActions.assertSideBar(true);
  });

  it ('打开 api 面板，目录树收缩', function() {
    toolbarActions.toggleApiPanel();
    sidebarActions.assertSideBar(false);
  });
  
  it ('api 面板连续切换过程，强制展开目录树', function() {
    toolbarActions.toggleApiPanel();
    sidebarActions.toggleSideBar();
    toolbarActions.toggleApiPanel();
    sidebarActions.assertSideBar(true);
  });
});
