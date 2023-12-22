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

package com.apitable.space.mapper;

import com.apitable.space.entity.SpaceInviteRecordEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * space invite record mapper.
 */
public interface SpaceInviteRecordMapper extends BaseMapper<SpaceInviteRecordEntity> {

    /**
     * All the specified invitation email links in the spaces have expired.
     *
     * @param spaceIds space ids
     * @param email    email
     * @return affected rows
     */
    int expireBySpaceIdAndEmail(@Param("spaceIds") List<String> spaceIds,
                                @Param("email") String email);

    /**
     * All the specified invitation email links in the space have expired.
     *
     * @param spaceId space id
     * @param emails  emails
     * @return affected rows
     */
    int expireBySpaceIdAndEmails(@Param("spaceId") String spaceId,
                                 @Param("emails") Collection<String> emails);

    /**
     * Query invite record.
     *
     * @param inviteToken invite unique token
     * @return invite records
     */
    SpaceInviteRecordEntity selectByInviteToken(@Param("inviteToken") String inviteToken);

}
