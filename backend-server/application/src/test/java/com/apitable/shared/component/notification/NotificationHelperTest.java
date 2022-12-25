/*
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

package com.apitable.shared.component.notification;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class NotificationHelperTest {

    @Test
    void TestIsNodeOperateWithCorrectDatasheetPath() {
        String servletPath = "/internal/spaces/spcjXzqVrjaP3/datasheets";
        boolean isNodeOperation = NotificationHelper.isNodeOperate(servletPath);
        Assertions.assertTrue(isNodeOperation);
    }

    @Test
    void TestIsNodeOperateWithIncorrectDatasheetPath() {
        String servletPath = "/internal/spaces/spcjXzqVrjaP3/datasheets/abc";
        boolean isNodeOperation = NotificationHelper.isNodeOperate(servletPath);
        Assertions.assertFalse(isNodeOperation);
    }

    @Test
    void TestIsNodeOperateWithCorrectNodePath() {
        String servletPath = "/internal/spaces/spcjXzqVrjaP3/nodes/dstNiC6R9MryevVaCQ/delete";
        boolean isNodeOperation = NotificationHelper.isNodeOperate(servletPath);
        Assertions.assertTrue(isNodeOperation);
    }

    @Test
    void TestIsNodeOperateWithIncorrectNodePath() {
        String servletPath = "/internal/spaces/spcjXzqVrjaP3/nodes/dstNiC6R9MryevVaCQ/";
        boolean isNodeOperation = NotificationHelper.isNodeOperate(servletPath);
        Assertions.assertFalse(isNodeOperation);
    }

    @Test
    void TestIsNodeOperateWithNode() {
        String servletPath = "/node/create";
        boolean isNodeOperation = NotificationHelper.isNodeOperate(servletPath);
        Assertions.assertTrue(isNodeOperation);
    }

    @Test
    void TestIsNodeOperateWithQuote() {
        String servletPath = "/template/quote";
        boolean isNodeOperation = NotificationHelper.isNodeOperate(servletPath);
        Assertions.assertTrue(isNodeOperation);
    }

}
