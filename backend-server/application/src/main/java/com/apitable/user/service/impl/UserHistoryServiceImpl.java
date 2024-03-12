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

import com.apitable.organization.dto.SpaceMemberDTO;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.user.dto.PausedUserHistoryDto;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.entity.UserHistoryEntity;
import com.apitable.user.enums.UserOperationType;
import com.apitable.user.mapper.UserHistoryMapper;
import com.apitable.user.service.IUserHistoryService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * <p>
 * User History Service Class.
 * </p>
 */
@Service
public class UserHistoryServiceImpl extends ServiceImpl<UserHistoryMapper, UserHistoryEntity>
    implements IUserHistoryService {

    @Resource
    private UserHistoryMapper userHistoryMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @Override
    public UserHistoryEntity getLatestUserHistoryEntity(Long userId,
                                                        UserOperationType userOperationType) {
        return userHistoryMapper.selectLatest(userId, userOperationType.getStatusCode());
    }

    @Override
    // TODO: move to User Service. added by troy.
    public boolean checkAccountAllowedToBeClosed(Long userId) {
        // Get all spaces managed by users
        List<MemberEntity> memberEntities = memberMapper.selectByUserId(userId);
        if (memberEntities.size() == 0) {
            return true;
        }
        List<Long> memberIds = memberEntities.stream().map(memberEntity -> memberEntity.getId())
            .collect(Collectors.toList());
        List<SpaceEntity> spaceEntities = spaceMapper.selectByUserId(userId);
        // Find out the main managed space
        List<String> spaceIdsInMainAdmin =
            spaceEntities.stream().filter(space -> memberIds.contains(space.getOwner()))
                .map(memberEntity -> memberEntity.getSpaceId()).collect(Collectors.toList());
        if (spaceIdsInMainAdmin.size() == 0) {
            return true;
        }
        // Get all space members
        List<SpaceMemberDTO> memberDtos = memberMapper.selectMembersBySpaceIds(spaceIdsInMainAdmin);
        // Classify space members
        Map<String, List<SpaceMemberDTO>> spaceMemberDtos = memberDtos.stream()
            .collect(Collectors.groupingBy(SpaceMemberDTO::getSpaceId));
        for (Map.Entry<String, List<SpaceMemberDTO>> entry : spaceMemberDtos.entrySet()) {
            // When managing a space station with more than one member, you are not allowed to cancel the account
            if (entry.getValue().size() > 1) {
                // if(manageSpaceWithMultipleMembers(userId, entry.getValue())) {
                return false;
            }
        }
        return true;
    }

    @Override
    public int create(UserEntity user, UserOperationType userOperationType) {
        UserHistoryEntity userHistory = transferDataFromUser(user);
        userHistory.setUserStatus(userOperationType.getStatusCode());
        return userHistoryMapper.insert(userHistory);
    }

    @Override
    public void create(UserHistoryEntity userHistory) {
        userHistoryMapper.insert(userHistory);
    }

    private UserHistoryEntity transferDataFromUser(UserEntity user) {
        UserHistoryEntity userHistory = UserHistoryEntity.builder().userId(user.getId())
            .uuid(user.getUuid())
            .nickName(user.getNickName())
            .code(user.getCode())
            .mobilePhone(user.getMobilePhone())
            .email(user.getEmail())
            .locale(user.getLocale())
            .createdBy(user.getId())
            .updatedBy(user.getId())
            .build();
        return userHistory;
    }

    @Override
    public List<PausedUserHistoryDto> getUserHistoryDtos(LocalDateTime createdAtBefore,
                                                         LocalDateTime createdAtAfter,
                                                         UserOperationType userOperationType) {
        List<PausedUserHistoryDto> userLatestHistoryDtos = new ArrayList<>();
        List<PausedUserHistoryDto> historyDtos =
            userHistoryMapper.selectUserHistoryDtos(createdAtBefore, createdAtAfter,
                userOperationType.getStatusCode());
        if (historyDtos.size() == 0) {
            return historyDtos;
        }
        Collections.sort(historyDtos, (h1, h2) -> h2.getCreatedAt().compareTo(h1.getCreatedAt()));

        Map<Long, List<PausedUserHistoryDto>> dtosClassifyByUserId = historyDtos.stream()
            .collect(Collectors.groupingBy(PausedUserHistoryDto::getUserId));
        for (Map.Entry<Long, List<PausedUserHistoryDto>> entry : dtosClassifyByUserId.entrySet()) {
            userLatestHistoryDtos.add(entry.getValue().get(0));
        }
        return userLatestHistoryDtos;
    }

    @Override
    public List<Long> getUserIdsByCreatedAtAndUserOperationType(LocalDateTime startAt,
                                                                LocalDateTime endAt,
                                                                UserOperationType operationType) {
        return baseMapper.selectUserIdsByCreatedAtAndUserStatus(startAt, endAt,
            operationType.getStatusCode());
    }

}
