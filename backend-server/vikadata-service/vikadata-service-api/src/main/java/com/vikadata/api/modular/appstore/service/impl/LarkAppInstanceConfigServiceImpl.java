package com.vikadata.api.modular.appstore.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.AppException;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.model.AppInstance;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfig;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfigProfile;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.appstore.service.ILarkAppInstanceConfigService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AppInstanceEntity;

import org.springframework.stereotype.Service;

/**
 * 飞书自建应用服务 接口 实现
 * @author Shawn Deng
 * @date 2021-12-31 17:49:58
 */
@Service
@Slf4j
public class LarkAppInstanceConfigServiceImpl implements ILarkAppInstanceConfigService {

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Override
    public LarkInstanceConfig getLarkConfig(String appInstanceId) {
        AppInstanceEntity instanceEntity = iAppInstanceService.getByAppInstanceId(appInstanceId);
        ExceptionUtil.isNotNull(instanceEntity, AppException.APP_INSTANCE_NOT_EXIST);
        return getLarkConfig(instanceEntity);
    }

    @Override
    public LarkInstanceConfig getLarkConfig(AppInstanceEntity instanceEntity) {
        LarkInstanceConfig config = LarkInstanceConfig.fromJsonString(instanceEntity.getConfig());
        if (config.getType() != AppType.LARK) {
            throw new BusinessException(AppException.NOT_LARK_APP_TYPE);
        }
        return config;
    }

    @Override
    public AppInstance updateLarkBaseConfig(String appInstanceId, String appKey, String appSecret) {
        log.info("初始化飞书配置");
        AppInstanceEntity instanceEntity = iAppInstanceService.getByAppInstanceId(appInstanceId);
        ExceptionUtil.isNotNull(instanceEntity, AppException.APP_INSTANCE_NOT_EXIST);
        // 检查是否是当前应用实例的配置应用KEY
        boolean isAppInstanceAppKeyExist = StrUtil.isNotBlank(instanceEntity.getAppKey()) && instanceEntity.getAppKey().equals(appKey);
        if (!isAppInstanceAppKeyExist) {
            // 不是本实例的配置，全局检查AppKey是否已经存在
            boolean isAppKeyExist = iAppInstanceService.isAppKeyExist(appKey);
            ExceptionUtil.isFalse(isAppKeyExist, AppException.APP_KEY_EXIST);
        }
        AppInstanceEntity updatedAppInstance = new AppInstanceEntity();
        updatedAppInstance.setId(instanceEntity.getId());
        updatedAppInstance.setAppKey(appKey);
        updatedAppInstance.setAppSecret(appSecret);
        LarkInstanceConfig config = getLarkConfig(instanceEntity);
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) config.getProfile();
        profile.setAppKey(appKey);
        profile.setAppSecret(appSecret);
        updatedAppInstance.setConfig(config.toJsonString());
        iAppInstanceService.updateById(updatedAppInstance);
        instanceEntity.setAppKey(appKey);
        instanceEntity.setAppSecret(appSecret);
        instanceEntity.setConfig(config.toJsonString());
        return iAppInstanceService.buildInstance(instanceEntity);
    }

    @Override
    public AppInstance updateLarkEventConfig(String appInstanceId, String eventEncryptKey, String eventVerificationToken) {
        LarkInstanceConfig config = getLarkConfig(appInstanceId);
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) config.getProfile();
        profile.setEventEncryptKey(eventEncryptKey);
        profile.setEventVerificationToken(eventVerificationToken);
        return iAppInstanceService.updateAppInstanceConfig(appInstanceId, config);
    }

    @Override
    public void updateLarkEventCheckStatus(String appInstanceId) {
        LarkInstanceConfig config = getLarkConfig(appInstanceId);
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) config.getProfile();
        profile.setEventCheck(true);
        iAppInstanceService.updateAppInstanceConfig(appInstanceId, config);
    }

    @Override
    public void updateLarkConfigCompleteStatus(String appInstanceId) {
        LarkInstanceConfig config = getLarkConfig(appInstanceId);
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) config.getProfile();
        profile.setConfigComplete(true);
        iAppInstanceService.updateAppInstanceConfig(appInstanceId, config);
    }

    @Override
    public void updateLarkContactSyncStatus(String appInstanceId) {
        LarkInstanceConfig config = getLarkConfig(appInstanceId);
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) config.getProfile();
        profile.setConfigComplete(true);
        profile.setContactSyncDone(true);
        iAppInstanceService.updateAppInstanceConfig(appInstanceId, config);
    }
}
