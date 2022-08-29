package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.mapper.SocialCpTenantUserMapper;
import com.vikadata.api.modular.social.model.CpTenantUserDTO;
import com.vikadata.api.modular.social.service.ISocialCpTenantUserService;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SocialCpTenantUserEntity;
import com.vikadata.entity.SocialCpUserBindEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DatabaseException.DELETE_ERROR;
import static com.vikadata.api.enums.exception.DatabaseException.INSERT_ERROR;

/**
 * <p>
 * 第三方平台集成-企业微信租户用户
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:20:01
 */
@Slf4j
@Service
public class SocialCpTenantUserServiceImpl extends ServiceImpl<SocialCpTenantUserMapper, SocialCpTenantUserEntity> implements ISocialCpTenantUserService {

    @Resource
    private ISocialCpUserBindService iSocialCpUserBindService;

    @Resource
    private IUserService iUserService;

    @Override
    public Long create(String tenantId, String appId, String cpUserId, String cpOpenUserId) {
        SocialCpTenantUserEntity entity = new SocialCpTenantUserEntity()
                .setTenantId(tenantId)
                .setAppId(appId)
                .setCpUserId(cpUserId)
                .setCpOpenUserId(cpOpenUserId);
        boolean flag = save(entity);
        ExceptionUtil.isTrue(flag, INSERT_ERROR);
        return entity.getId();
    }

    @Override
    public void createBatch(List<SocialCpTenantUserEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        baseMapper.insertBatch(entities);
    }

    @Override
    public SocialCpTenantUserEntity getCpTenantUser(String tenantId, String appId, String cpUserId) {
        return baseMapper.selectByTenantIdAndAppIdAndCpUserId(tenantId, appId, cpUserId);
    }

    @Override
    public SocialCpTenantUserEntity getCpTenantUser(String tenantId, String appId, Long userId) {
        return baseMapper.selectByTenantIdAndAppIdAndUserId(tenantId, appId, userId);
    }

    @Override
    public Long getCpTenantUserId(String tenantId, String appId, String cpUserId) {
        return baseMapper.selectIdByTenantIdAndAppIdAndCpUserId(tenantId, appId, cpUserId);
    }

    @Override
    public Map<String, UserEntity> getUserByCpUserIds(String tenantId, String appId, List<String> cpUserIds) {

        if (CollUtil.isEmpty(cpUserIds)) {
            return Collections.emptyMap();
        }

        // 通过 openId 查找到企微租户中的用户信息
        List<SocialCpTenantUserEntity> cpTenantUserEntities = baseMapper.selectByTenantIdAndAppIdAndCpUserIds(tenantId, appId, cpUserIds);
        if (CollUtil.isEmpty(cpTenantUserEntities)) {
            return Collections.emptyMap();
        }
        // 通过企微租户中的用户查找到与维格用户的绑定信息
        List<Long> cpTenantUserIds = cpTenantUserEntities.stream()
                .map(SocialCpTenantUserEntity::getId)
                .collect(Collectors.toList());
        List<SocialCpUserBindEntity> cpUserBindEntities = iSocialCpUserBindService.getByCpTenantUserIds(cpTenantUserIds);
        if (CollUtil.isEmpty(cpUserBindEntities)) {
            return Collections.emptyMap();
        }
        // 通过绑定信息查找到维格用户信息
        List<Long> userIds = cpUserBindEntities.stream()
                .map(SocialCpUserBindEntity::getUserId)
                .collect(Collectors.toList());
        List<UserEntity> userEntities = iUserService.listByIds(userIds);
        if (CollUtil.isEmpty(userEntities)) {
            return Collections.emptyMap();
        }

        // 转换 openId -> user 的对应信息
        Map<Long, Long> cpUserBindAndUserIdMap = cpUserBindEntities.stream()
                .collect(Collectors.toMap(SocialCpUserBindEntity::getCpTenantUserId, SocialCpUserBindEntity::getUserId, (k1, k2) -> k2));
        Map<Long, UserEntity> userMap = userEntities.stream()
                .collect(Collectors.toMap(UserEntity::getId, v -> v, (k1, k2) -> k2));
        Map<String, UserEntity> resultMap = Maps.newHashMapWithExpectedSize(userMap.size());
        for (SocialCpTenantUserEntity cpTenantUserEntity : cpTenantUserEntities) {
            UserEntity userEntity = Optional.ofNullable(cpUserBindAndUserIdMap.get(cpTenantUserEntity.getId()))
                    .map(userMap::get)
                    .orElse(null);
            if (Objects.nonNull(userEntity)) {
                resultMap.put(cpTenantUserEntity.getCpUserId(), userEntity);
            }
        }

        return resultMap;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDeleteByCorpAgentUsers(String tenantId, String appId, List<String> removeCpUserIds) {
        if (CollUtil.isEmpty(removeCpUserIds)) {
            return;
        }
        boolean flag = SqlHelper.retBool(baseMapper.batchDeleteByCorpAgent(tenantId, appId, removeCpUserIds));
        ExceptionUtil.isTrue(flag, DELETE_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDeleteByCorpAgent(String tenantId, String appId) {
        // 查询所有已同步用户
        Map<String, Long> openUsers = getOpenIdsByTenantId(tenantId, appId);
        if (MapUtil.isNotEmpty(openUsers)) {
            // 删除企业微信租户用户
            this.batchDeleteByCorpAgentUsers(tenantId, appId, new ArrayList<>(openUsers.keySet()));
            // 删除企业微信租户绑定VikaUser关系
            iSocialCpUserBindService.batchDeleteByCpTenantUserIds(new ArrayList<>(openUsers.values()));
        }
    }

    @Override
    public Map<String, Long> getOpenIdsByTenantId(String tenantId, String appId) {
        List<CpTenantUserDTO> dto = baseMapper.selectOpenIdsByTenantId(tenantId, appId);
        if (CollUtil.isEmpty(dto)) {
            return new LinkedHashMap<>();
        }
        return dto.stream().collect(Collectors.toMap(CpTenantUserDTO::getCpUserId, CpTenantUserDTO::getCpTenantUserId, (k1, k2) -> k1, LinkedHashMap::new));
    }

}
