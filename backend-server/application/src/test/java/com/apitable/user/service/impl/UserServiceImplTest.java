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

package com.apitable.user.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollectionUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.ro.UserOpRo;
import java.util.List;
import org.junit.jupiter.api.Test;

public class UserServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testEditUserAvatar() {
        MockUserSpace userSpace = createSingleUserAndSpace();

        UserOpRo param = new UserOpRo();
        param.setAvatar("public/2023/01/04/11c74fbfc96541b3a2ffd3ee8217dcc0");
        param.setAvatarColor(null);

        iUserService.edit(userSpace.getUserId(), param);
        List<UserEntity> users =
            iUserService.listByIds(CollectionUtil.newArrayList(userSpace.getUserId()));
        assertThat(users.get(0).getAvatar()).isEqualTo(
            "public/2023/01/04/11c74fbfc96541b3a2ffd3ee8217dcc0");
    }

    @Test
    public void testEditUserAvtarColor() {
        MockUserSpace userSpace = createSingleUserAndSpace();

        UserOpRo param = new UserOpRo();
        param.setAvatar(null);
        param.setAvatarColor(5);

        iUserService.edit(userSpace.getUserId(), param);
        List<UserEntity> users =
            iUserService.listByIds(CollectionUtil.newArrayList(userSpace.getUserId()));
        assertThat(users.get(0).getAvatar()).isNull();
    }

    @Test
    public void testEditUserNickName() {
        MockUserSpace userSpace = createSingleUserAndSpace();

        UserOpRo param = new UserOpRo();
        param.setInit(false);
        param.setNickName("testName");

        iUserService.edit(userSpace.getUserId(), param);
        List<UserEntity> users =
            iUserService.listByIds(CollectionUtil.newArrayList(userSpace.getUserId()));
        assertThat(users.get(0).getNickName()).isEqualTo("testName");
    }

    @Test
    public void testEditUserTimeZone() {
        MockUserSpace userSpace = createSingleUserAndSpace();

        UserOpRo param = new UserOpRo();
        param.setTimeZone("Asia/Shanghai");

        iUserService.edit(userSpace.getUserId(), param);
        UserEntity user = iUserService.getById(userSpace.getUserId());
        assertThat(user.getTimeZone()).isEqualTo("Asia/Shanghai");
    }

    @Test
    public void testEditPassword() {
        MockUserSpace userSpace = createSingleUserAndSpace();

        iUserService.updatePwd(userSpace.getUserId(), "123456");

        UserEntity userEntity = iUserService.getById(userSpace.getUserId());
        assertThat(userEntity.getPassword()).isNotBlank();
    }

    @Test
    public void testClosePausedAccount() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iUserService.applyForClosingAccount(iUserService.getById(userSpace.getUserId()));
        getClock().addDays(2);
        iUserService.closePausedUser(1);
        UserEntity result = iUserService.getById(userSpace.getUserId());
        assertThat(result).isNull();
    }

    @Test
    public void testCloseAccountWithCanceledApply() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iUserService.applyForClosingAccount(iUserService.getById(userSpace.getUserId()));
        getClock().addDays(2);
        iUserService.cancelClosingAccount(iUserService.getById(userSpace.getUserId()));
        iUserService.closePausedUser(1);
        UserEntity result = iUserService.getById(userSpace.getUserId());
        assertThat(result.getIsPaused()).isFalse();
    }

    @Test
    public void testCloseAccountWithManyOperation() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iUserService.applyForClosingAccount(iUserService.getById(userSpace.getUserId()));
        getClock().addDays(1);
        iUserService.cancelClosingAccount(iUserService.getById(userSpace.getUserId()));
        iUserService.applyForClosingAccount(iUserService.getById(userSpace.getUserId()));
        getClock().addDays(1);
        iUserService.closePausedUser(1);
        UserEntity result = iUserService.getById(userSpace.getUserId());
        assertThat(result).isNull();
    }

    @Test
    public void testCloseAccountWithManyOperationAndCanceledApply() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iUserService.applyForClosingAccount(iUserService.getById(userSpace.getUserId()));
        getClock().addDays(1);
        iUserService.cancelClosingAccount(iUserService.getById(userSpace.getUserId()));
        iUserService.applyForClosingAccount(iUserService.getById(userSpace.getUserId()));
        getClock().addDays(1);
        iUserService.cancelClosingAccount(iUserService.getById(userSpace.getUserId()));
        iUserService.closePausedUser(1);
        UserEntity result = iUserService.getById(userSpace.getUserId());
        assertThat(result).isNotNull();
        assertThat(result.getIsPaused()).isFalse();

    }
}
