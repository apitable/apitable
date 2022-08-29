package com.vikadata.api.modular.appstore.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.AppException;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.factory.LarkConfigFactory;
import com.vikadata.api.modular.appstore.mapper.AppInstanceMapper;
import com.vikadata.api.modular.appstore.model.AppInstance;
import com.vikadata.api.modular.appstore.model.InstanceConfig;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfig;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfigProfile;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.marketplace.service.IMarketplaceAppService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.IWeComService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.AppInstanceEntity;
import com.vikadata.entity.MarketplaceSpaceAppRelEntity;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.app.AppStore;
import com.vikadata.system.config.app.AppStoreConfig;
import com.vikadata.system.config.marketplace.App;
import com.vikadata.system.config.marketplace.MarketPlaceConfig;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.AppException.APP_EXIST;
import static com.vikadata.api.enums.exception.AppException.APP_NOT_EXIST;
import static com.vikadata.api.enums.exception.AuthException.UNAUTHORIZED;
import static com.vikadata.api.enums.exception.SpaceException.NOT_SPACE_MAIN_ADMIN;

/**
 * 应用实例服务 实现
 * @author Shawn Deng
 * @date 2022-01-17 15:23:39
 */
@Service
@Slf4j
public class AppInstanceServiceImpl extends ServiceImpl<AppInstanceMapper, AppInstanceEntity> implements IAppInstanceService {

    @Resource
    private AppInstanceMapper appInstanceMapper;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private IMarketplaceAppService iMarketplaceAppService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IWeComService iWeComService;

    @Override
    public List<AppInstanceEntity> getAppInstances(String spaceId) {
        return appInstanceMapper.selectBySpaceId(spaceId);
    }

    @Override
    public AppInstanceEntity getByAppInstanceId(String appInstanceId) {
        return appInstanceMapper.selectByAppInstanceId(appInstanceId);
    }

    @Override
    public boolean isAppInstanceAppKeyExist(String appInstanceId, String appKey) {
        return SqlTool.retCount(appInstanceMapper.selectCountByAppInstanceIdAndAppKey(appInstanceId, appKey)) > 0;
    }

    @Override
    public boolean isAppKeyExist(String appKey) {
        return SqlTool.retCount(appInstanceMapper.selectCountByAppKey(appKey)) > 0;
    }

    @Override
    public AppInstanceEntity getBySpaceIdAndAppId(String spaceId, String appId) {
        return appInstanceMapper.selectBySpaceIdAndAppId(spaceId, appId);
    }

    @Override
    public AppInstanceEntity getInstanceBySpaceIdAndAppType(String spaceId, AppType appType) {
        AppStoreConfig appStoreConfig = SystemConfigManager.getConfig().getAppStores();
        List<AppInstanceEntity> instanceEntities = getAppInstances(spaceId);
        if (CollUtil.isEmpty(instanceEntities)) {
            return null;
        }
        List<AppInstanceEntity> larkInstanceEntities = instanceEntities.stream()
                .filter(instance -> AppType.of(appStoreConfig.get(instance.getAppId()).getType()) == appType)
                .collect(Collectors.toList());
        if (CollUtil.isEmpty(larkInstanceEntities)) {
            log.error("空间没有绑定飞书自建应用类型的应用实例: {}", spaceId);
            return null;
        }
        if (larkInstanceEntities.size() > 1) {
            log.error("空间有多个同类型的应用实例: {}", spaceId);
            return null;
        }
        return CollUtil.getFirst(larkInstanceEntities);
    }

    @Override
    public FeishuConfigStorage buildConfigStorageByInstanceId(String appInstanceId) {
        AppInstanceEntity appInstanceEntity = getByAppInstanceId(appInstanceId);
        ExceptionUtil.isNotNull(appInstanceEntity, AppException.APP_INSTANCE_NOT_EXIST);
        AppStoreConfig appStore = SystemConfigManager.getConfig().getAppStores();
        AppType appType = AppType.of(appStore.get(appInstanceEntity.getAppId()).getType());
        if (appType == AppType.LARK) {
            LarkInstanceConfig instanceConfig = LarkInstanceConfig.fromJsonString(appInstanceEntity.getConfig());
            // 设置动态属性
            LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
            if (StrUtil.isNotBlank(profile.getAppKey()) && StrUtil.isNotBlank(profile.getAppSecret()) && StrUtil.isNotBlank(profile.getEventVerificationToken())) {
                return profile.buildConfigStorage();
            }
        }
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void compatibleMarketPlace(String spaceId) {
        // 查询商店应用列表
        String officePreviewOldId = "ina5645957505507647";
        List<String> marketPlaceAppIds = iMarketplaceAppService.getAppIdsBySpaceId(spaceId);
        // 排除掉其他
        marketPlaceAppIds.removeIf(appId -> !appId.equals(officePreviewOldId));
        MarketPlaceConfig marketPlaceConfig = SystemConfigManager.getConfig().getMarketplace();
        Set<String> marketAppType = new HashSet<>(marketPlaceAppIds.size());
        marketPlaceAppIds.forEach(appId -> {
            App app = marketPlaceConfig.get(appId);
            marketAppType.add(AppType.valueOf(app.getAppType()).name());
        });
        SocialTenantEntity socialTenant = getSocialTenantBind(spaceId);
        if (socialTenant != null) {
            AppType appType = getSocialTenantAppType(socialTenant);
            if (appType != null) {
                marketAppType.add(appType.name());
            }
        }
        List<AppInstanceEntity> instanceEntities = getAppInstances(spaceId);
        AppStoreConfig appStoreConfig = SystemConfigManager.getConfig().getAppStores();
        List<String> existInstance = new ArrayList<>();
        instanceEntities.forEach(appInstance -> existInstance.add(appStoreConfig.get(appInstance.getAppId()).getType()));
        Map<String, AppStore> appStoreMap = new HashMap<>();
        appStoreConfig.values().forEach(appStore -> appStoreMap.put(appStore.getType(), appStore));
        // 将marketplace的数据迁移过来
        marketAppType.forEach(appType -> {
            if (!existInstance.contains(appType)) {
                // 未包含，直接创建
                create(spaceId, appStoreMap.get(appType).getId());
            }
        });
    }

    public SocialTenantEntity getSocialTenantBind(String spaceId) {
        SocialTenantBindEntity tenantBindEntity = iSocialTenantBindService.getBySpaceId(spaceId);
        if (tenantBindEntity == null) {
            return null;
        }
        return iSocialTenantService.getByAppIdAndTenantId(tenantBindEntity.getAppId(), tenantBindEntity.getTenantId());
    }

    public AppType getSocialTenantAppType(SocialTenantEntity socialTenant) {
        SocialPlatformType socialPlatformType = SocialPlatformType.toEnum(socialTenant.getPlatform());
        SocialAppType socialAppType = SocialAppType.of(socialTenant.getAppType());
        if (socialPlatformType == SocialPlatformType.DINGTALK) {
            if (socialAppType == SocialAppType.INTERNAL) {
                return AppType.DINGTALK;
            }
            else if (socialAppType == SocialAppType.ISV) {
                return AppType.DINGTALK_STORE;
            }
        }
        else if (socialPlatformType == SocialPlatformType.FEISHU) {
            if (socialAppType == SocialAppType.INTERNAL) {
                return AppType.LARK;
            }
            else if (socialAppType == SocialAppType.ISV) {
                return AppType.LARK_STORE;
            }
        }
        else if (socialPlatformType == SocialPlatformType.WECOM) {
            if (socialAppType == SocialAppType.INTERNAL) {
                return AppType.WECOM;
            }
            else if (socialAppType == SocialAppType.ISV) {
                return AppType.WECOM_STORE;
            }
        }
        return null;
    }

    @Override
    public boolean checkInstanceExist(String spaceId, String appType) {
        AppInstanceEntity appInstance = getInstanceBySpaceAndAppType(spaceId, appType);
        if (appInstance == null) {
            MarketPlaceConfig marketPlaceConfig = SystemConfigManager.getConfig().getMarketplace();
            App app = marketPlaceConfig.ofAppType(appType);
            if (app != null) {
                // 同步数据
                return iMarketplaceAppService.checkBySpaceIdAndAppId(spaceId, app.getAppId());
            }
            return false;
        }
        return true;
    }

    public AppInstanceEntity getInstanceBySpaceAndAppType(String spaceId, String appType) {
        List<AppInstanceEntity> instanceEntities = getAppInstances(spaceId);
        AppStoreConfig appStoreConfig = SystemConfigManager.getConfig().getAppStores();
        for (AppInstanceEntity appInstance : instanceEntities) {
            AppStore appStore = appStoreConfig.get(appInstance.getAppId());
            AppType type = AppType.valueOf(appStore.getType());
            if (type.name().equalsIgnoreCase(appType)) {
                return appInstance;
            }
        }
        return null;
    }

    @Override
    public List<AppInstance> getAppInstancesBySpaceId(String spaceId) {
        // 查询应用实例列表
        List<AppInstanceEntity> instanceEntities = getAppInstances(spaceId);
        List<AppInstance> appInstances = new ArrayList<>();
        if (CollUtil.isEmpty(instanceEntities)) {
            return appInstances;
        }
        instanceEntities.forEach(instance -> appInstances.add(buildInstance(instance)));
        return appInstances;
    }

    @Override
    public AppInstance getAppInstance(String appInstanceId) {
        AppInstanceEntity appInstanceEntity = getByAppInstanceId(appInstanceId);
        ExceptionUtil.isNotNull(appInstanceEntity, AppException.APP_INSTANCE_NOT_EXIST);
        return buildInstance(appInstanceEntity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createInstanceByAppType(String spaceId, String appType) {
        AppStoreConfig appStoreConfig = SystemConfigManager.getConfig().getAppStores();
        AppStore appStore = appStoreConfig.ofType(appType);
        if (appStore == null) {
            throw new RuntimeException("应用不存在");
        }
        // 判断空间是否已经开通过
        AppInstanceEntity instance = getBySpaceIdAndAppId(spaceId, appStore.getId());
        ExceptionUtil.isNull(instance, APP_EXIST);
        create(spaceId, appStore.getId());
        // 冗余数据以防回滚版本
        MarketPlaceConfig marketPlaceConfig = SystemConfigManager.getConfig().getMarketplace();
        App app = marketPlaceConfig.ofAppType(appType);
        if (app != null) {
            iMarketplaceAppService.openSpaceApp(spaceId, app.getAppId());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AppInstance createInstance(String spaceId, String appId) {
        // 判断应用是否存在
        AppStoreConfig appStore = SystemConfigManager.getConfig().getAppStores();
        ExceptionUtil.isTrue(appStore.containsKey(appId), APP_NOT_EXIST);
        // 判断空间是否已经开通过
        AppInstanceEntity instance = getBySpaceIdAndAppId(spaceId, appId);
        ExceptionUtil.isNull(instance, APP_EXIST);
        // 冗余数据以防回滚版本
        MarketPlaceConfig marketPlaceConfig = SystemConfigManager.getConfig().getMarketplace();
        App app = marketPlaceConfig.ofAppType(appStore.get(appId).getType());
        if (app != null) {
            iMarketplaceAppService.openSpaceApp(spaceId, app.getAppId());
        }
        // 创建实例
        return create(spaceId, appId);
    }

    @Override
    public AppInstance create(String spaceId, String appId) {
        AppInstanceEntity instanceEntity = new AppInstanceEntity();
        instanceEntity.setSpaceId(spaceId);
        instanceEntity.setAppId(appId);
        instanceEntity.setAppInstanceId(String.format("ai-%s", IdUtil.fastSimpleUUID()));
        AppStoreConfig appStoreConfig = SystemConfigManager.getConfig().getAppStores();
        AppStore appStore = appStoreConfig.get(appId);
        AppType appType = AppType.of(appStore.getType());
        instanceEntity.setType(appType.name());
        if (appType == AppType.LARK) {
            LarkInstanceConfigProfile profile = new LarkInstanceConfigProfile("", "");
            LarkInstanceConfig config = new LarkInstanceConfig(profile);
            instanceEntity.setConfig(config.toJsonString());
        }
        save(instanceEntity);
        return buildInstance(instanceEntity);
    }

    @Override
    public AppInstance updateAppInstanceConfig(String appInstanceId, InstanceConfig config) {
        AppInstanceEntity instanceEntity = appInstanceMapper.selectByAppInstanceId(appInstanceId);
        ExceptionUtil.isNotNull(instanceEntity, AppException.APP_INSTANCE_NOT_EXIST);
        AppInstanceEntity appInstanceEntity = new AppInstanceEntity();
        appInstanceEntity.setId(instanceEntity.getId());
        appInstanceEntity.setConfig(config.toJsonString());
        updateById(appInstanceEntity);
        instanceEntity.setConfig(config.toJsonString());
        return buildInstance(instanceEntity);
    }

    @Override
    public void updateAppInstanceStatus(String appInstanceId, boolean isEnabled) {
        AppInstanceEntity instanceEntity = appInstanceMapper.selectByAppInstanceId(appInstanceId);
        ExceptionUtil.isNotNull(instanceEntity, AppException.APP_INSTANCE_NOT_EXIST);
        AppInstanceEntity appInstanceEntity = new AppInstanceEntity();
        appInstanceEntity.setId(instanceEntity.getId());
        appInstanceEntity.setIsEnabled(isEnabled);
        updateById(appInstanceEntity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteAppInstance(Long userId, String appInstanceId) {
        AppInstanceEntity instanceEntity = appInstanceMapper.selectByAppInstanceId(appInstanceId);
        ExceptionUtil.isNotNull(instanceEntity, AppException.APP_INSTANCE_NOT_EXIST);
        // 校验
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, instanceEntity.getSpaceId());
        // 检测停用的空间是否是当前用户的空间
        ExceptionUtil.isNotNull(memberId, UNAUTHORIZED);
        // 检测是否是主管理员
        Long mainMemberId = iSpaceService.getSpaceMainAdminMemberId(instanceEntity.getSpaceId());
        ExceptionUtil.isTrue(ObjectUtil.equal(memberId, mainMemberId), NOT_SPACE_MAIN_ADMIN);
        // 删除相关应用
        AppStoreConfig appStoreConfig = SystemConfigManager.getConfig().getAppStores();
        AppStore appStore = appStoreConfig.get(instanceEntity.getAppId());
        AppType appType = AppType.of(appStore.getType());
        if (appType == AppType.LARK) {
            // 删除飞书租户配置
            LarkInstanceConfig instanceConfig = LarkInstanceConfig.fromJsonString(instanceEntity.getConfig());
            // 设置动态属性
            LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
            if (StrUtil.isNotBlank(profile.getAppKey()) && StrUtil.isNotBlank(profile.getAppSecret()) && StrUtil.isNotBlank(profile.getEventVerificationToken())) {
                String spaceId = instanceEntity.getSpaceId();
                List<String> tenantIds = iSocialTenantBindService.getTenantIdBySpaceId(spaceId);
                if (CollUtil.isNotEmpty(tenantIds)) {
                    // 查询租户信息
                    List<SocialTenantEntity> tenantEntities = iSocialTenantService.getByTenantIds(tenantIds);
                    if (CollUtil.isNotEmpty(tenantEntities)) {
                        List<SocialTenantEntity> feishuTenants = tenantEntities.stream()
                                .filter(tenant -> SocialPlatformType.toEnum(tenant.getPlatform()) == SocialPlatformType.FEISHU
                                        && SocialAppType.of(tenant.getAppType()) == SocialAppType.INTERNAL)
                                .collect(Collectors.toList());
                        feishuTenants.forEach(tenant -> iSocialTenantService.removeInternalTenant(profile.getAppKey(), tenant.getTenantId(), spaceId));
                    }
                }
            }
        }
        else if (appType == AppType.DINGTALK) {
            // 钉钉应用停用逻辑
            iSocialTenantService.removeSpaceIdSocialBindInfo(instanceEntity.getSpaceId());
        }
        else if (appType == AppType.WECOM) {
            // 企业微信停用逻辑
            iWeComService.stopWeComApp(instanceEntity.getSpaceId());
        }
        appInstanceMapper.deleteByAppInstanceId(appInstanceId);
        MarketPlaceConfig marketPlaceConfig = SystemConfigManager.getConfig().getMarketplace();
        App app = marketPlaceConfig.ofAppType(appType.name());
        if (app != null) {
            iMarketplaceAppService.removeBySpaceIdAndAppId(instanceEntity.getSpaceId(), app.getAppId());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBySpaceIdAndAppType(String spaceId, String appType) {
        AppInstanceEntity appInstance = getInstanceBySpaceAndAppType(spaceId, appType);
        if (appInstance != null) {
            appInstanceMapper.deleteByAppInstanceId(appInstance.getAppInstanceId());
        }
        MarketPlaceConfig marketPlaceConfig = SystemConfigManager.getConfig().getMarketplace();
        App app = marketPlaceConfig.ofAppType(appType);
        if (app != null) {
            // 同步删除数据
            MarketplaceSpaceAppRelEntity marketplaceSpaceAppRelEntity = iMarketplaceAppService.getBySpaceIdAndAppId(spaceId, app.getAppId());
            if (marketplaceSpaceAppRelEntity != null) {
                iMarketplaceAppService.removeById(marketplaceSpaceAppRelEntity.getId());
            }
        }
    }

    @Override
    public AppInstance buildInstance(AppInstanceEntity instanceEntity) {
        AppInstance appInstance = new AppInstance();
        appInstance.setSpaceId(instanceEntity.getSpaceId());
        appInstance.setAppId(instanceEntity.getAppId());
        appInstance.setAppInstanceId(instanceEntity.getAppInstanceId());
        appInstance.setIsEnabled(instanceEntity.getIsEnabled());
        appInstance.setCreatedAt(instanceEntity.getCreatedAt());
        AppStoreConfig appStore = SystemConfigManager.getConfig().getAppStores();
        appInstance.setType(appStore.get(instanceEntity.getAppId()).getType());
        AppType appType = AppType.of(appInstance.getType());
        if (appType == AppType.LARK) {
            LarkInstanceConfig instanceConfig = LarkInstanceConfig.fromJsonString(instanceEntity.getConfig());
            // 设置动态属性
            LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
            if (StrUtil.isNotBlank(profile.getAppKey()) && StrUtil.isNotBlank(profile.getAppSecret())) {
                String redirectUri = LarkConfigFactory.createRedirectUri(instanceEntity.getAppInstanceId());
                profile.setRedirectUrl(redirectUri);
                String entryUrl = LarkConfigFactory.createAuthUrl(profile.getAppKey(), redirectUri);
                profile.setPcUrl(entryUrl);
                profile.setMobileUrl(entryUrl);
            }
            if (StrUtil.isNotBlank(profile.getEventVerificationToken())) {
                profile.setEventUrl(LarkConfigFactory.createEventUri(instanceEntity.getAppInstanceId()));
            }
            instanceConfig.setProfile(profile);
            appInstance.setConfig(instanceConfig);
        }
        return appInstance;
    }
}
