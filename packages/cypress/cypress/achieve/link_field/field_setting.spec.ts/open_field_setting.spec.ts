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

import { openFieldSetting } from "cypress/support/common";

describe('是否有权限打开列配置', () => {
  beforeEach(() => {
    (async () => {
      await cy.login();
    })();
  });

  const checkExistSettingEntry = (fieldName: string, chainer: string) => {
    openFieldSetting(fieldName);
    cy.get('.styles_fieldOperateBox__WB-74').should(chainer);
  };

  describe('当前表可管理', function () {
    beforeEach(() => {
      cy.open('/space/spcfan7hTtnxg/workbench/dstCiLHpaWejq46PcY/viwCCmpN4f5MU');
    });
    it('关联表可管理', function () {
      checkExistSettingEntry('可管理 E', 'to.be.exist');
    });

    it('关联表可编辑', function () {
      checkExistSettingEntry('可编辑 B', 'to.be.exist');
    });

    it('关联表可查看', function () {
      checkExistSettingEntry('可查看 C', 'to.be.exist');
    });

    it('关联表不可见', function () {
      checkExistSettingEntry('不可见 D', 'to.be.exist');
    });
  });

  const checkNoPermission = () => {
    it('关联表可管理', function () {

      checkExistSettingEntry('可管理 A', 'to.be.not.exist');
    });

    it('关联表可编辑', function () {
      checkExistSettingEntry('可编辑 B', 'to.be.not.exist');
    });

    it('关联表可查看', function () {
      checkExistSettingEntry('可查看 C', 'to.be.not.exist');
    });

    it('关联表不可见', function () {
      checkExistSettingEntry('不可见 D', 'to.be.not.exist');
    });
  };

  describe('当前表可编辑', function () {

    beforeEach(() => {
      cy.open('/space/spcfan7hTtnxg/workbench/dstwSUth6wVblDR3HC/viwsCy2XqN0pK');
    });
    checkNoPermission();
  });

  describe('当前表可查看', function () {

    beforeEach(() => {
      cy.open('/space/spcfan7hTtnxg/workbench/dstzrxGc62ipfGATp9/viwSxzooVub0C');
    });
    checkNoPermission();
  });
});
