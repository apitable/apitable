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

package com.apitable.shared.support.serializer;

import cn.hutool.core.collection.ListUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.mapper.UserMapper;
import com.apitable.user.vo.UserSimpleVO;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * String to json.
 */
public class UserIdToUserObjectSerializer extends JsonSerializer<Long> {

    @Override
    public void serialize(Long value, JsonGenerator gen, SerializerProvider provider)
        throws IOException {
        UserMapper userMapper = SpringContextHolder.getBean(UserMapper.class);
        Map<Long, UserSimpleVO> user =  userMapper.selectByIds(ListUtil.toList(value)).stream().collect(
            Collectors.toMap(UserEntity::getId, i ->  {
                UserSimpleVO vo = new UserSimpleVO();
                vo.setUuid(i.getUuid());
                vo.setNickName(i.getNickName());
                vo.setAvatar(i.getAvatar());
                return vo;
            }));
        gen.writeObject(user.get(value));
    }
}
