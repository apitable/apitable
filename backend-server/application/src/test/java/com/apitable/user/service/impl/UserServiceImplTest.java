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

import cn.hutool.core.collection.CollectionUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.mapper.UserMapper;
import com.apitable.user.ro.UserOpRo;
import org.junit.jupiter.api.Test;

import javax.annotation.Resource;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class UserServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private UserMapper userMapper;

    @Test
    public void testEditUserAvatar(){
        MockUserSpace userSpace = createSingleUserAndSpace();

        UserOpRo param = new UserOpRo();
        param.setAvatar("public/2023/01/04/11c74fbfc96541b3a2ffd3ee8217dcc0");
        param.setAvatarColor(null);

        iUserService.edit(userSpace.getUserId(), param);
        List<UserEntity> users = userMapper.selectByIds(CollectionUtil.newArrayList(userSpace.getUserId()));
        assertThat(users.get(0).getAvatar()).isEqualTo("public/2023/01/04/11c74fbfc96541b3a2ffd3ee8217dcc0");
    }

    @Test
    public void testEditUserAvtarColor(){
        MockUserSpace userSpace = createSingleUserAndSpace();

        UserOpRo param = new UserOpRo();
        param.setAvatar(null);
        param.setAvatarColor(5);

        iUserService.edit(userSpace.getUserId(), param);
        List<UserEntity> users = userMapper.selectByIds(CollectionUtil.newArrayList(userSpace.getUserId()));
        assertThat(users.get(0).getAvatar()).isNull();
    }

    @Test
    public void testEditUserNickName(){
        MockUserSpace userSpace = createSingleUserAndSpace();

        UserOpRo param = new UserOpRo();
        param.setInit(false);
        param.setNickName("testName");

        iUserService.edit(userSpace.getUserId(), param);
        List<UserEntity> users = userMapper.selectByIds(CollectionUtil.newArrayList(userSpace.getUserId()));
        assertThat(users.get(0).getNickName()).isEqualTo("testName");
    }
}
