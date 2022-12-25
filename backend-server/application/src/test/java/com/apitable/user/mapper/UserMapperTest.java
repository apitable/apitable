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

package com.apitable.user.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.apache.ibatis.cursor.Cursor;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.vo.InviteUserInfo;
import com.apitable.user.dto.UserInPausedDto;
import com.apitable.user.dto.UserLangDTO;
import com.apitable.user.entity.UserEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Interface access layer test: user table test
 * </p>
 */
public class UserMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    UserMapper userMapper;

    @Test
    @Sql("/sql/user-data.sql")
    void testSelectUserNameById() {
        String name = userMapper.selectNickNameById(41L);
        assertThat(name).isEqualTo("41");
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectEmailById() {
        String email = userMapper.selectEmailById(41L);
        assertThat(email).isEqualTo("41@apitable.com");
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectIdByMobile() {
        Long id = userMapper.selectIdByMobile("41");
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectByMobile() {
        UserEntity entity = userMapper.selectByMobile("41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectByEmail() {
        UserEntity entity = userMapper.selectByEmail("41@apitable.com");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectCountByEmail() {
        Integer count = userMapper.selectCountByEmail("41@apitable.com");
        assertThat(count).isEqualTo(1);
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectByEmails() {
        List<UserEntity> entities = userMapper.selectByEmails(CollUtil.newArrayList("41@apitable.com"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectIdByUuid() {
        Long id = userMapper.selectIdByUuid("41");
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectIdByUuidList() {
        List<Long> ids = userMapper.selectIdByUuidList(CollUtil.newArrayList("41"));
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectUuidById() {
        String uuid = userMapper.selectUuidById(41L);
        assertThat(uuid).isEqualTo("41");
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectByIds() {
        List<UserEntity> entities = userMapper.selectByIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/user-data.sql")
    void testSelectByUuIds() {
        List<UserEntity> entities = userMapper.selectByUuIds(CollUtil.newArrayList("23a5f52cd1ee4e6abdc8a77e9b73cdeb"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectAllUserIdByIgnoreDelete() {
        Cursor<Long> entities = userMapper.selectAllUserIdByIgnoreDelete(false);
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectEmailByUserIds() {
        List<String> emails = userMapper.selectEmailByUserIds(CollUtil.newArrayList(41L));
        assertThat(emails).isNotEmpty();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectLocaleInEmailsWithDefaultLocale() {
        List<UserLangDTO> entities = userMapper.selectLocaleInEmailsWithDefaultLocale("zh-CN", CollUtil.newArrayList("41@apitable.com"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectLocaleByEmail() {
        UserLangDTO userLangDTO = userMapper.selectLocaleByEmail("41@apitable.com");
        assertThat(userLangDTO).isNotNull();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectLocaleByEmailWithDefaultLocale() {
        UserLangDTO entity = userMapper.selectLocaleByEmailWithDefaultLocale("zh-CN", "41@apitable.com");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectLocaleAndEmailByIds() {
        List<UserLangDTO> entities = userMapper.selectLocaleAndEmailByIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectPausedUsers() {
        List<UserInPausedDto> entities = userMapper.selectPausedUsers(CollUtil.newArrayList(45L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/user-data.sql")
    void testSelectInviteUserInfoByUserId(){
        Long userId = 41L;
        InviteUserInfo inviteUserInfo = userMapper.selectInviteUserInfoByUserId(userId);
        assertThat(inviteUserInfo.getUserName()).isEqualTo("41");
    }

}
