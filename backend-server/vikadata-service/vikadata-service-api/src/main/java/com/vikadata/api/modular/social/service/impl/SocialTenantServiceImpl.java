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
 * Third party integration - enterprise tenant service interface implementation
 * </p>
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
        log.info("Third party platform type:{}, enterprise tenants opening applications: {}", socialType.getValue(), tenantId);
        SocialTenantEntity tenant = new SocialTenantEntity();
        tenant.setAppId(appId);
        tenant.setAppType(appType.getType());
        tenant.setPlatform(socialType.getValue());
        tenant.setTenantId(tenantId);
        tenant.setContactAuthScope(contactScope);
        boolean flag = save(tenant);
        if (!flag) {
            throw new RuntimeException("[Lark] Failed to add tenant");
        }
    }

    @Override
    public void updateTenantStatus(String appId, String tenantId, boolean enabled) {
        // Update tenant's status
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
        // Change the tenant stop enabling status
        updateTenantStatus(appId, tenantId, false);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeTenant(String appId, String tenantId, String spaceId) {
        // Invitable status of all members of the recovery space (synchronize the default configuration of the startup space)
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
        iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
        iAppInstanceService.deleteBySpaceIdAndAppType(spaceId, AppType.LARK_STORE.name());
        // Change the tenant stop enabling status
        updateTenantStatus(appId, tenantId, false);
        // Delete space binding
        iSocialTenantBindService.removeBySpaceIdAndTenantId(spaceId, tenantId);
        // Delete the tenant's department record and binding
        iSocialTenantDepartmentService.deleteByTenantId(spaceId, tenantId);
        // Delete tenant's user record
        iSocialTenantUserService.deleteByTenantId(appId, tenantId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeInternalTenant(String appId, String tenantId, String spaceId) {
        SocialTenantEntity tenant = socialTenantMapper.selectByAppIdAndTenantId(appId, tenantId);
        if (tenant != null) {
            removeById(tenant);
        }
        // Delete the bound open IDs of all members of the space
        List<MemberEntity> memberEntities = iMemberService.getMembersBySpaceId(spaceId, true);
        if (!memberEntities.isEmpty()) {
            memberEntities.forEach(memberEntity -> iMemberService.clearOpenIdById(memberEntity.getId()));
        }
        // Invitable status of all members of the recovery space (synchronize the default configuration of the startup space)
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
        iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
        iSocialTenantBindService.removeBySpaceIdAndTenantId(spaceId, tenantId);
        // Delete the tenant's department record and binding
        iSocialTenantDepartmentService.deleteByTenantIdAndSpaceId(tenantId, spaceId);
        // Delete tenant's user record
        iSocialTenantUserService.deleteByAppIdAndTenantId(appId, tenantId);
    }

    @Override
    public SocialTenantEntity getByAppIdAndTenantId(String appId, String tenantId) {
        return socialTenantMapper.selectByAppIdAndTenantId(appId, tenantId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeSpaceIdSocialBindInfo(String spaceId) {
        // DingTalk binding logic
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        ExceptionUtil.isNotNull(bindInfo, TENANT_APP_BIND_INFO_NOT_EXISTS);
        String tenantId = bindInfo.getTenantId();
        // Get the number of current enterprise app to determine whether to delete enterprise organization information
        int appCount = socialTenantMapper.selectCountByTenantId(tenantId);
        // Invitable status of all members of the recovery space (synchronize the default configuration of the startup space)
        Long mainAdminUserId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().invitable(true).build();
        iSpaceService.switchSpacePros(mainAdminUserId, spaceId, feature);
        // Delete the tenant's department records and bindings to prevent multiple applications from being deleted by mistake
        iSocialTenantDepartmentService.deleteByTenantIdAndSpaceId(tenantId, spaceId);
        // Delete space binding
        iSocialTenantBindService.removeBySpaceId(spaceId);
        // When there is only one application, delete the tenant's user record.
        // Because the open ID of the same enterprise is the same, the member's open ID will not be deleted here, because there may be repeated binding
        if (appCount <= 1) {
            List<String> openIds = memberMapper.selectOpenIdBySpaceId(CollUtil.toList(spaceId));
            if (!openIds.isEmpty()) {
                iSocialTenantUserService.deleteByTenantIdAndOpenIds(bindInfo.getAppId(), tenantId, openIds);
            }
        }
        String appId = bindInfo.getAppId();
        if (StrUtil.isNotBlank(appId)) {
            // Deactivate app
            socialTenantMapper.setTenantStop(appId, tenantId);
            // Delete callback
            dingTalkService.deleteCallbackUrl(dingTalkService.getAgentIdByAppIdAndTenantId(appId, tenantId));
        }
    }

    @Override
    public void createOrUpdateWithScope(SocialPlatformType socialType, SocialAppType appType, String appId,
            String tenantId, String scope, String authInfo) {
        // There is no enterprise application information and it needs to be created. If there is information, but the status is disabled, it needs to be re enabled. Here, an enterprise may have multiple applications
        SocialTenantEntity entity = getByAppIdAndTenantId(appId, tenantId);
        if (entity == null) {
            log.info("Third party platform type:{}, Enterprise tenants opening applications: {}, open application: {}", socialType.getValue(), tenantId, appId);
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
                throw new RuntimeException("Failed to add tenant");
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
                throw new RuntimeException("Failed to update tenant");
            }
        }
    }

    @Override
    public void createOrUpdateByTenantAndApp(SocialTenantEntity entity) {
        SocialTenantEntity existedEntity = getByAppIdAndTenantId(entity.getAppId(), entity.getTenantId());
        if (Objects.isNull(existedEntity)) {
            // The third-party platform information does not exist, new create
            boolean isSaved = save(entity);
            if (!isSaved) {
                throw new IllegalStateException("No tenant data saved.");
            }
        }
        else {
            // If the information already exists, update the relevant data
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
