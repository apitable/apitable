package com.vikadata.api.cache.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.SpaceResourceDto;
import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.enums.exception.SpaceException;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.UnitMapper;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.mapper.SpaceMemberRoleRelMapper;
import com.vikadata.api.modular.space.mapper.SpaceResourceMapper;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UnitEntity;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;

@Service
@Slf4j
public class UserSpaceRedisServiceImpl implements UserSpaceService {

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
        boolean isAdmin = SqlTool.retCount(spaceMemberRoleRelMapper.selectCountBySpaceIdAndMemberId(spaceId, memberId)) > 0;
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
        Integer isSocialNameModified = ObjectUtil.defaultIfNull(memberEntity.getIsSocialNameModified(), SocialNameModified.NO_SOCIAL.getValue());
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
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserSpaceKey(userId, spaceId));
        opts.set(JSONUtil.toJsonStr(userSpaceDto), TIMEOUT, TimeUnit.HOURS);
        return userSpaceDto;
    }

    @Override
    public Long getMemberId(Long userId, String spaceId) {
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserSpaceKey(userId, spaceId));
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
    public void delete(Long userId, String spaceId) {
        redisTemplate.delete(RedisConstants.getUserSpaceKey(userId, spaceId));
    }

    @Override
    public UserSpaceDto getUserSpace(Long userId, String spaceId) {
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserSpaceKey(userId, spaceId));
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
            boolean containSecuritySetting = CollUtil.isNotEmpty(userSpaceDto.getResourceGroupCodes());
            return containSecuritySetting ?
                    userSpaceDto :
                    this.saveUserSpace(userId, spaceId, userSpaceDto.getMemberId());
        }
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
        ExceptionUtil.isNotNull(memberId, NOT_IN_SPACE);
        return this.saveUserSpace(userId, spaceId, memberId);
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
        userIds.forEach(userId -> redisTemplate.delete(RedisConstants.getUserSpaceKey(userId, spaceId)));
    }
}
