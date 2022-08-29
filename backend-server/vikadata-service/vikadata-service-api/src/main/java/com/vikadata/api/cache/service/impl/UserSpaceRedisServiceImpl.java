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
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UnitEntity;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;


/**
 * <p>
 * 用户空间 服务接口 实现
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/13 12:17
 */
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

    /**
     * 存储时间，单位：小时
     */
    private static final int TIMEOUT = 2;

    @Override
    public UserSpaceDto saveUserSpace(Long userId, String spaceId, Long memberId) {
        log.info("缓存用户对应空间相关信息");
        // 查询用户对应空间信息
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
        // 兼容字段为"NULL"的情况，默认值为：2
        Integer isSocialNameModified = ObjectUtil.defaultIfNull(memberEntity.getIsSocialNameModified(), SocialNameModified.NO_SOCIAL.getValue());
        userSpaceDto.setIsMemberNameModified(isSocialNameModified > 0);
        if (isMainAdmin || isAdmin) {
            List<SpaceResourceDto> spaceResources = new ArrayList<>();
            //查询用户在空间的权限，
            if (isMainAdmin) {
                //主管理默认继承所有权限
                spaceResources = spaceResourceMapper.selectAllResource();
            }
            if (isAdmin) {
                //子管理员
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
        log.info("根据用户查询对应空间的成员id");
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserSpaceKey(userId, spaceId));
        String str = opts.get();
        if (str != null) {
            return Optional.ofNullable(JSONUtil.toBean(str, UserSpaceDto.class).getMemberId())
                    .orElseThrow(() -> new BusinessException(NOT_IN_SPACE));
        }
        //获取成员ID
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
        //判断是否存在
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
        log.info("获取用户对应空间的内容");
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserSpaceKey(userId, spaceId));
        String str = opts.get();
        if (str != null) {
            // 获取用户空间信息
            UserSpaceDto userSpaceDto = JSONUtil.toBean(str, UserSpaceDto.class);
            /*
             * 如果缓存值为null，刷新缓存
             * 1.字段IsMemberNameModified新增于2022-03-11，之前成员没有对应的缓存key，字段有默认值
             */
            if (Objects.isNull(userSpaceDto.getIsMemberNameModified())) {
                return this.saveUserSpace(userId, spaceId, userSpaceDto.getMemberId());
            }
            // 判断是否为主管理员
            boolean isMainAdmin = userSpaceDto.isMainAdmin();
            // 如果不是主管理员直接返回
            if (!isMainAdmin) {
                return userSpaceDto;
            }
            // 判断是否包含『企业安全中心』相关的资源配置项
            boolean containSecuritySetting = CollUtil.isNotEmpty(userSpaceDto.getResourceGroupCodes());
            // 角色为主管理员并且没有『企业安全中心』的资源配置项，则刷新缓存
            return containSecuritySetting ?
                    userSpaceDto :
                    this.saveUserSpace(userId, spaceId, userSpaceDto.getMemberId());
        }
        // 获取成员ID
        Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
        // 判断是否存在
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
