/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { closeDescModal } from 'cypress/support/common';
import { sidebarUtils } from 'cypress/support/actions/sidebar';
import { toolbarUtils } from 'cypress/support/actions/toolbar';

const sidebarActions = sidebarUtils();
const toolbarActions = toolbarUtils();

describe('Directory tree with right-hand panel', () => {
  beforeEach(() => {
    (async() => {
      await cy.login();
    })();

    cy.link('/workbench/dst44uPc6pmp7GjVYZ/viw84T0Tfc66p');
    closeDescModal();
  });

  it ('Open the robot panel and keep the directory tree expanded', function() {
    toolbarActions.toggleRobotPanel();
    sidebarActions.assertSideBar(true);
  });

  it ('Continuously switch api panels and expand the directory tree', function() {
    toolbarActions.toggleApiPanel();
    toolbarActions.toggleApiPanel();
    sidebarActions.assertSideBar(true);
  });

  it ('Open the api panel and shrink the directory tree', function() {
    toolbarActions.toggleApiPanel();
    sidebarActions.assertSideBar(false);
  });

  it ('Continuous switching process of the api panel, forcing the expansion of the directory tree', function() {
    toolbarActions.toggleApiPanel();
    sidebarActions.toggleSideBar();
    toolbarActions.toggleApiPanel();
    sidebarActions.assertSideBar(true);
  });
});
