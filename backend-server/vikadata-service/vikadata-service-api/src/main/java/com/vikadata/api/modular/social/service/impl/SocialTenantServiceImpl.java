package com.vikadata.api.modular.social.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialTenantAuthMode;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.mapper.SocialTenantMapper;
import com.vikadata.api.modular.social.model.TenantBaseInfoDto;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.SocialException.TENANT_APP_BIND_INFO_NOT_EXISTS;

/**
 * <p>
 * 第三方集成 - 企业租户 服务 接口实现
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/30 17:14
 */
@Service
@Slf4j
public class SocialTenantServiceImpl extends ServiceImpl<SocialTenantMapper, SocialTenantEntity> implements ISocialTenantService {

    @Resource
    private SocialTenantMapper socialTenantMapper;

    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialTenantDepartmentService iSocialTenantDepartmentService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IDingTalkService dingTalkService;

    @Override
    public boolean isTenantExist(String tenantId, String appId) {
        return SqlTool.retCount(socialTenantMapper.selectCountByAppIdAndTenantId(appId, tenantId)) > 0;
    }

    @Override
    public void createTenant(SocialPlatformType socialType, SocialAppType appType, String appId, String tenantId, String contactScope) {
        log.info("第三方平台类型:{}, 开通应用的企业租户: {}", socialType.getValue(), tenantId);
        SocialTenantEntity tenant = new SocialTenantEntity();
        tenant.setAppId(appId);
        tenant.setAppType(appType.getType());
        tenant.setPlatform(socialType.getValue());
        tenant.setTenantId(tenantId);
        tenant.setContactAuthScope(contactScope);
        boolean flag = save(tenant);
        if (!flag) {
            throw new RuntimeException("[飞书] 新增租户失败");
        }
    }

    @Override
    public void updateTenantStatus(String appId, String tenantId, boolean enabled) {
        // 更新租户的状态
        socialTenantMapper.updateTenantStatus(appId, tenantId, enabled);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void stopByTenant(String appId, String tenantId) {
        List<String> spaceIds = iSocialTenantBindService.getSpaceIdsByTenantIdAndAppId(tenantId, appId);
        if (CollUtil.isNotEmpty(spaceIds)) {
            for (String spaceId : spaceIds) {
                iAppInstanceService.deleteBySpaceIdAndAppType(spaceId, AppType.LARK_STORE.name());
            }
        }
        // 更改租户停启用状态
        updateTenantStatus(appId, tenantId, false);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeTenant(String appId, String tenantId, String spaceId) {
        // 恢复空间的全员可邀请状态（同步初创空间的默认配置）
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
        iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
        iAppInstanceService.deleteBySpaceIdAndAppType(spaceId, AppType.LARK_STORE.name());
        // 更改租户停启用状态
        updateTenantStatus(appId, tenantId, false);
        // 删除空间的绑定
        iSocialTenantBindService.removeBySpaceIdAndTenantId(spaceId, tenantId);
        // 删除租户的部门记录以及绑定
        iSocialTenantDepartmentService.deleteByTenantId(spaceId, tenantId);
        // 删除租户的用户记录
        iSocialTenantUserService.deleteByTenantId(appId, tenantId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeInternalTenant(String appId, String tenantId, String spaceId) {
        SocialTenantEntity tenant = socialTenantMapper.selectByAppIdAndTenantId(appId, tenantId);
        if (tenant != null) {
            removeById(tenant);
        }
        // 删除空间所有成员的已绑定的openId
        List<MemberEntity> memberEntities = iMemberService.getMembersBySpaceId(spaceId, true);
        if (!memberEntities.isEmpty()) {
            memberEntities.forEach(memberEntity -> iMemberService.clearOpenIdById(memberEntity.getId()));
        }
        // 恢复空间的全员可邀请状态（同步初创空间的默认配置）
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
        iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
        iSocialTenantBindService.removeBySpaceIdAndTenantId(spaceId, tenantId);
        // 删除租户的部门记录以及绑定
        iSocialTenantDepartmentService.deleteByTenantIdAndSpaceId(tenantId, spaceId);
        // 删除租户的用户记录
        iSocialTenantUserService.deleteByAppIdAndTenantId(appId, tenantId);
    }

    @Override
    public SocialTenantEntity getByAppIdAndTenantId(String appId, String tenantId) {
        return socialTenantMapper.selectByAppIdAndTenantId(appId, tenantId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeSpaceIdSocialBindInfo(String spaceId) {
        // 钉钉绑定逻辑
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        ExceptionUtil.isNotNull(bindInfo, TENANT_APP_BIND_INFO_NOT_EXISTS);
        String tenantId = bindInfo.getTenantId();
        // 获取当前企业app的数量，用于判断是否删除企业组织信息
        int appCount = socialTenantMapper.selectCountByTenantId(tenantId);
        // 恢复空间的全员可邀请状态（同步初创空间的默认配置）
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
        iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
        // 删除租户的部门记录以及绑定,防止多应用误删
        iSocialTenantDepartmentService.deleteByTenantIdAndSpaceId(tenantId, spaceId);
        // 删除空间的绑定
        iSocialTenantBindService.removeBySpaceId(spaceId);
        // 只有一个应用的时候，删除租户的用户记录，因为同一个企业的openId是一样的,这里不删除member的openId，因为可能存在重复绑定的情况
        if (appCount <= 1) {
            List<String> openIds = memberMapper.selectOpenIdBySpaceId(CollUtil.toList(spaceId));
            if (!openIds.isEmpty()) {
                iSocialTenantUserService.deleteByTenantIdAndOpenIds(bindInfo.getAppId(), tenantId, openIds);
            }
        }
        String appId = bindInfo.getAppId();
        if (StrUtil.isNotBlank(appId)) {
            // 停用应用
            socialTenantMapper.setTenantStop(appId, tenantId);
            // 删出回调
            dingTalkService.deleteCallbackUrl(dingTalkService.getAgentIdByAppIdAndTenantId(appId, tenantId));
        }
    }

    @Override
    public void createOrUpdateWithScope(SocialPlatformType socialType, SocialAppType appType, String appId,
            String tenantId, String scope, String authInfo) {
        // 没有企业应用信息，需要新建,如果有信息，但是状态是停用，需要重新启用, 这里因为一个企业可能有多个应用
        SocialTenantEntity entity = getByAppIdAndTenantId(appId, tenantId);
        if (entity == null) {
            log.info("第三方平台类型:{}, 开通应用的企业租户: {}, 开通应用: {}", socialType.getValue(), tenantId, appId);
            SocialTenantEntity tenant = new SocialTenantEntity();
            tenant.setAppId(appId);
            tenant.setAppType(appType.getType());
            tenant.setPlatform(socialType.getValue());
            tenant.setTenantId(tenantId);
            tenant.setContactAuthScope(scope);
            tenant.setAuthMode(SocialTenantAuthMode.ADMIN.getValue());
            tenant.setAuthInfo(authInfo);
            boolean flag = SqlHelper.retBool(socialTenantMapper.insert(tenant));
            if (!flag) {
                throw new RuntimeException("新增租户失败");
            }
        }
        if (entity != null) {
            entity.setStatus(true);
            if (authInfo != null) {
                entity.setAuthInfo(authInfo);
            }
            if (scope != null) {
                entity.setContactAuthScope(scope);
            }
            boolean flag = SqlHelper.retBool(socialTenantMapper.updateById(entity));
            if (!flag) {
                throw new RuntimeException("更新租户失败");
            }
        }
    }

    @Override
    public void createOrUpdateByTenantAndApp(SocialTenantEntity entity) {
        SocialTenantEntity existedEntity = getByAppIdAndTenantId(entity.getAppId(), entity.getTenantId());
        if (Objects.isNull(existedEntity)) {
            // 该第三方平台信息不存在，新增
            boolean isSaved = save(entity);
            if (!isSaved) {
                throw new IllegalStateException("No tenant data saved.");
            }
        }
        else {
            // 信息已存在，则更新相关数据
            existedEntity.setContactAuthScope(entity.getContactAuthScope());
            existedEntity.setAuthMode(entity.getAuthMode());
            existedEntity.setPermanentCode(entity.getPermanentCode());
            existedEntity.setAuthInfo(entity.getAuthInfo());
            existedEntity.setStatus(entity.getStatus());
            existedEntity.setUpdatedAt(LocalDateTime.now());
            boolean isUpdated = updateById(existedEntity);
            if (!isUpdated) {
                throw new IllegalStateException("No tenant data updated.");
            }
        }

    }

    @Override
    public String getDingTalkAppAgentId(String tenantId, String appId) {
        return baseMapper.selectAgentIdByTenantIdAndAppId(tenantId, appId);
    }

    @Override
    public TenantBaseInfoDto getTenantBaseInfo(String tenantId, String appId) {
        SocialTenantEntity entity = baseMapper.selectByAppIdAndTenantId(appId, tenantId);
        return SocialFactory.getTenantBaseInfoFromAuthInfo(entity.getAuthInfo(), SocialAppType.of(entity.getAppType()),
                SocialPlatformType.toEnum(entity.getPlatform()));
    }

    @Override
    public boolean isTenantActive(String tenantId, String appId) {
        Integer status = baseMapper.selectTenantStatusByTenantIdAndAppId(tenantId, appId);
        return SqlHelper.retBool(status);
    }

    @Override
    public List<SocialTenantEntity> getByTenantIds(List<String> tenantIds) {
        return socialTenantMapper.selectByTenantIds(tenantIds);
    }

    @Override
    public List<SocialTenantEntity> getByPlatformTypeAndAppType(SocialPlatformType platformType, SocialAppType appType) {
        return socialTenantMapper.selectByPlatformTypeAndAppType(platformType, appType);
    }

    @Override
    public List<String> getSpaceIdsByPlatformTypeAndAppType(SocialPlatformType platformType, SocialAppType appType) {
        List<SocialTenantEntity> tenants = socialTenantMapper.selectByPlatformTypeAndAppType(platformType, appType);
        Set<String> tenantIds = new HashSet<>();
        Set<String> appIds = new HashSet<>();
        tenants.forEach(i -> {
            tenantIds.add(i.getTenantId());
            appIds.add(i.getAppId());
        });
        return iSocialTenantBindService.getSpaceIdsByTenantIdsAndAppIds(new ArrayList<>(tenantIds), new ArrayList<>(appIds));
    }

    @Override
    public String getPermanentCodeByAppIdAndTenantId(String appId, String tenantId) {
        return socialTenantMapper.selectPermanentCodeByAppIdAndTenantId(appId, tenantId);
    }

    @Override
    public LocalDateTime getCreatedAtByAppIdAndTenantId(String appId, String tenantId) {
        return socialTenantMapper.selectCreatedAtByAppIdAndTenantId(appId, tenantId);
    }
}
