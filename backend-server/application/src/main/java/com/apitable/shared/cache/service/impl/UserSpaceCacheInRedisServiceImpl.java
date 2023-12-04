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

package com.apitable.shared.cache.service.impl;

import static com.apitable.space.enums.SpaceException.NOT_IN_SPACE;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.core.constants.RedisConstants;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.social.enums.SocialNameModified;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.shared.cache.bean.SpaceResourceDto;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.enums.SpaceException;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.mapper.SpaceMemberRoleRelMapper;
import com.apitable.space.mapper.SpaceResourceMapper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * user space cache service in redis implementation.
 */
@Service
@Slf4j
public class UserSpaceCacheInRedisServiceImpl implements UserSpaceCacheService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private UnitMapper unitMapper;

    @Resource
    private SpaceResourceMapper spaceResourceMapper;

    @Resource
    private SpaceMemberRoleRelMapper spaceMemberRoleRelMapper;

    private static final int TIMEOUT = 2;

    @Override
    public UserSpaceDto saveUserSpace(Long userId, String spaceId, Long memberId) {
        MemberEntity memberEntity = memberMapper.selectMemberIdAndSpaceId(spaceId, memberId);
        ExceptionUtil.isNotNull(memberEntity, NOT_IN_SPACE);
        UnitEntity unitEntity = unitMapper.selectByRefId(memberId);
        ExceptionUtil.isNotNull(unitEntity, NOT_IN_SPACE);
        SpaceEntity spaceEntity = spaceMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(spaceEntity, SpaceException.SPACE_NOT_EXIST);
        boolean isMainAdmin = memberId.equals(spaceEntity.getOwner());
        boolean isAdmin = SqlTool.retCount(
            spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId)) > 0;
        UserSpaceDto userSpaceDto = new UserSpaceDto();
        userSpaceDto.setUserId(userId);
        userSpaceDto.setSpaceId(spaceId);
        userSpaceDto.setSpaceName(spaceEntity.getName());
        userSpaceDto.setSpaceLogo(spaceEntity.getLogo());
        userSpaceDto.setMemberId(memberId);
        userSpaceDto.setMemberName(memberEntity.getMemberName());
        userSpaceDto.setUnitId(unitEntity.getId());
        userSpaceDto.setMainAdmin(isMainAdmin);
        userSpaceDto.setAdmin(isAdmin);
        userSpaceDto.setDel(spaceEntity.getPreDeletionTime() != null);
        userSpaceDto.setIsNameModified(memberEntity.getNameModified());
        Integer isSocialNameModified =
            ObjectUtil.defaultIfNull(memberEntity.getIsSocialNameModified(),
                SocialNameModified.NO_SOCIAL.getValue());
        userSpaceDto.setIsMemberNameModified(isSocialNameModified > 0);
        if (isMainAdmin || isAdmin) {
            List<SpaceResourceDto> spaceResources = new ArrayList<>();
            if (isMainAdmin) {
                spaceResources = spaceResourceMapper.selectAllResource();
            }
            if (isAdmin) {
                spaceResources = spaceResourceMapper.selectResourceByMemberId(memberId);
            }
            Set<String> resourceCodes = new HashSet<>();
            Set<String> resourceGroupCodes = new HashSet<>();
            for (SpaceResourceDto spaceResource : spaceResources) {
                resourceCodes.add(spaceResource.getResourceCode());
                resourceGroupCodes.add(spaceResource.getGroupCode());
            }
            userSpaceDto.setResourceCodes(resourceCodes);
            userSpaceDto.setResourceGroupCodes(resourceGroupCodes);
        }
        BoundValueOperations<String, String> opts =
            redisTemplate.boundValueOps(RedisConstants.getUserSpaceKey(userId, spaceId));
        opts.set(JSONUtil.toJsonStr(userSpaceDto), TIMEOUT, TimeUnit.HOURS);
        return userSpaceDto;
    }

    @Override
    public Long getMemberId(Long userId, String spaceId) {
        BoundValueOperations<String, String> opts =
            redisTemplate.boundValueOps(RedisConstants.getUserSpaceKey(userId, spaceId));
        String str = opts.get();
        if (str != null) {
            return Optional.ofNullable(JSONUtil.toBean(str, UserSpaceDto.class).getMemberId())
                .orElseThrow(() -> new BusinessException(NOT_IN_SPACE));
        }
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
        ExceptionUtil.isNotNull(memberId, NOT_IN_SPACE);
        this.saveUserSpace(userId, spaceId, memberId);
        return memberId;
    }

    @Override
    public UserSpaceDto getUserSpace(Long userId, String spaceId) {
        BoundValueOperations<String, String> opts =
            redisTemplate.boundValueOps(RedisConstants.getUserSpaceKey(userId, spaceId));
        String str = opts.get();
        if (str != null) {
            UserSpaceDto userSpaceDto = JSONUtil.toBean(str, UserSpaceDto.class);
            if (Objects.isNull(userSpaceDto.getIsMemberNameModified())) {
                return this.saveUserSpace(userId, spaceId, userSpaceDto.getMemberId());
            }
            boolean isMainAdmin = userSpaceDto.isMainAdmin();
            if (!isMainAdmin) {
                return userSpaceDto;
            }
            boolean containSecuritySetting =
                CollUtil.isNotEmpty(userSpaceDto.getResourceGroupCodes());
            return containSecuritySetting
                ? userSpaceDto : this.saveUserSpace(userId, spaceId, userSpaceDto.getMemberId());
        }
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
        ExceptionUtil.isNotNull(memberId, NOT_IN_SPACE);
        return this.saveUserSpace(userId, spaceId, memberId);
    }

    @Override
    public void delete(Long userId, String spaceId) {
        redisTemplate.delete(RedisConstants.getUserSpaceKey(userId, spaceId));
    }

    @Override
    public void delete(String spaceId, List<Long> memberIds) {
        if (CollUtil.isNotEmpty(memberIds)) {
            List<Long> userIds = memberMapper.selectUserIdsByMemberIds(memberIds);
            if (CollUtil.isNotEmpty(userIds)) {
                for (Long userId : userIds) {
                    if (userId != null) {
                        redisTemplate.delete(RedisConstants.getUserSpaceKey(userId, spaceId));
                    }
                }
            }
        }
    }

    @Override
    public void delete(String spaceId) {
        List<Long> userIds = memberMapper.selectUserIdBySpaceId(spaceId);
        userIds.forEach(
            userId -> redisTemplate.delete(RedisConstants.getUserSpaceKey(userId, spaceId)));
    }
}
