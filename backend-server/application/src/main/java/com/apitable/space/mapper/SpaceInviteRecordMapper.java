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
import java.time.LocalDateTime;
import java.util.Collection;
import org.apache.ibatis.annotations.Param;

/**
 * space invite record mapper.
 */
public interface SpaceInviteRecordMapper extends BaseMapper<SpaceInviteRecordEntity> {

    /**
     * All the specified invitation email links in the space have expired.
     *
     * @param spaceId    space id
     * @param emails     emails
     * @param statusDesc status description
     * @return affected rows
     */
    int expireBySpaceIdAndEmails(@Param("spaceId") String spaceId,
                                 @Param("emails") Collection<String> emails,
                                 @Param("statusDesc") String statusDesc);

    /**
     * Expire by space id and invite member ids.
     *
     * @param spaceId    space id
     * @param memberIds  invite member ids
     * @param statusDesc status description
     * @return affected rows
     */
    int expireBySpaceIdAndInviteMemberId(@Param("spaceId") String spaceId,
                                         @Param("memberIds") Collection<Long> memberIds,
                                         @Param("statusDesc") String statusDesc);

    /**
     * Expire by invite token.
     *
     * @param inviteToken invite token
     * @param statusDesc  status description
     * @return affected rows
     * @author Chambers
     */
    int expireByInviteToken(@Param("inviteToken") String inviteToken,
                            @Param("statusDesc") String statusDesc);

    /**
     * Query invite record.
     *
     * @param inviteToken invite unique token
     * @return invite records
     */
    SpaceInviteRecordEntity selectByInviteToken(@Param("inviteToken") String inviteToken);

    /**
     * query space invite record within the specified time.
     *
     * @param spaceId space id
     * @param startAt start time
     * @param endAt   end time
     * @return count
     */
    Integer selectCountBySpaceIdAndBetween(@Param("spaceId") String spaceId,
                                           @Param("startAt") LocalDateTime startAt,
                                           @Param("endAt") LocalDateTime endAt);

}
