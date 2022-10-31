package com.vikadata.api.modular.social.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.modular.service.ExpandServiceImpl;
import com.vikadata.api.modular.social.mapper.SocialTenantUserMapper;
import com.vikadata.api.modular.social.model.SocialTenantUserDTO;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.social.service.ISocialUserService;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.SocialTenantUserEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Third party platform integration - enterprise tenant user service interface implementation
 */
@Service
@Slf4j
public class SocialTenantUserServiceImpl extends ExpandServiceImpl<SocialTenantUserMapper, SocialTenantUserEntity> implements ISocialTenantUserService {

    @Resource
    private SocialTenantUserMapper socialTenantUserMapper;

    @Resource
    private ISocialUserService iSocialUserService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Override
    public void create(String appId, String tenantId, String openId, String unionId) {
        SocialTenantUserEntity tenantUserEntity = new SocialTenantUserEntity();
        tenantUserEntity.setAppId(appId);
        tenantUserEntity.setTenantId(tenantId);
        tenantUserEntity.setOpenId(openId);
        tenantUserEntity.setUnionId(unionId);
        save(tenantUserEntity);
    }

    @Override
    public void createBatch(List<SocialTenantUserEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        saveBatch(entities);
    }

    @Override
    public List<String> getOpenIdsByTenantId(String appId, String tenantId) {
        return socialTenantUserMapper.selectOpenIdsByTenantId(appId, tenantId);
    }

    @Override
    public List<String> getOpenIdsByAppIdAndTenantId(String appId, String tenantId) {
        return socialTenantUserMapper.selectOpenIdsByTenantId(appId, tenantId);
    }

    @Override
    public String getUnionIdByOpenId(String appId, String tenantId, String openId) {
        return socialTenantUserMapper.selectUnionIdByOpenId(appId, tenantId, openId);
    }

    @Override
    public boolean isTenantUserOpenIdExist(String appId, String tenantId, String openId) {
        return SqlTool.retCount(socialTenantUserMapper.selectCountByTenantIdAndOpenId(appId, tenantId, openId)) > 0;
    }

    @Override
    public boolean isTenantUserUnionIdExist(String appId, String tenantId, String openId, String unionId) {
        List<String> unionIds = socialTenantUserMapper.selectUnionIdsByOpenIds(appId, tenantId,
                Collections.singletonList(openId));
        return ObjectUtil.isNotEmpty(unionIds) && unionIds.contains(unionId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTenantId(String appId, String tenantId) {
        List<String> unionIds = socialTenantUserMapper.selectUnionIdsByTenantId(appId, tenantId);
        if (CollUtil.isNotEmpty(unionIds)) {
            iSocialUserService.deleteBatchByUnionId(unionIds);
            iUserLinkService.deleteBatchByUnionId(unionIds);
        }
        // Delete Record
        socialTenantUserMapper.deleteByTenantId(appId, tenantId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByFeishuOpenIds(String appId, String tenantId, List<String> openIds) {
        if (CollUtil.isEmpty(openIds)) {
            return;
        }
        socialTenantUserMapper.deleteBatchByTenantIdAndOpenId(appId, tenantId, openIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTenantIdAndOpenId(String appId, String tenantId, String openId) {
        // Lark tenant employee deletion is conditional on employee resignation
        String unionId = socialTenantUserMapper.selectUnionIdByOpenId(appId, tenantId, openId);
        if (StrUtil.isNotBlank(unionId)) {
            iSocialUserService.deleteBatchByUnionId(Collections.singletonList(unionId));
            iUserLinkService.deleteBatchByUnionId(Collections.singletonList(unionId));
        }
        socialTenantUserMapper.deleteByTenantIdAndOpenId(appId, tenantId, openId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTenantIdAndOpenIds(String appId, String tenantId, List<String> openIds) {
        if (CollUtil.isNotEmpty(openIds)) {
            // Delete Record
            socialTenantUserMapper.deleteBatchByOpenId(appId, tenantId, openIds);
        }
    }

    @Override
    public void deleteByAppIdAndTenantId(String appId, String tenantId) {
        socialTenantUserMapper.deleteByAppIdAndTenantId(appId, tenantId);
    }

    @Override
    public Long getUserIdByDingTalkUnionId(String unionId) {
        String openId = baseMapper.selectOpenIdByUnionIdAndPlatform(unionId, SocialPlatformType.DINGTALK);
        if (StrUtil.isNotBlank(openId)) {
            return userLinkMapper.selectUserIdByUnionIdAndOpenIdAndType(unionId, openId, LinkType.DINGTALK);
        }
        return userLinkMapper.selectUserIdByUnionIdAndType(unionId, LinkType.DINGTALK.getType());
    }

    @Override
    public Map<String, List<String>> getOpenIdMapByTenantId(String appId, String tenantId) {
        List<SocialTenantUserDTO> tenantUsers = socialTenantUserMapper.selectOpenIdAndUnionIdByTenantId(tenantId, appId);
        if (!ObjectUtil.isEmpty(tenantUsers)) {
            return tenantUsers.stream().collect(Collectors.groupingBy(SocialTenantUserDTO::getOpenId,
                    Collectors.mapping(SocialTenantUserDTO::getUnionId, Collectors.toList())));
        }
        return new HashMap<>();
    }

    @Override
    public String getOpenIdByTenantIdAndUserId(String appId, String tenantId, Long userId) {
        // Query the union ID bound by the user
        List<String> unionIds = iSocialUserBindService.getUnionIdsByUserId(userId);
        if (unionIds.isEmpty()) {
            return null;
        }
        List<String> openIds = socialTenantUserMapper.selectOpenIdByAppIdAndTenantIdAndUnionIds(appId, tenantId, unionIds);
        return openIds.stream().findFirst().orElse(null);
    }
}
