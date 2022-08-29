package com.vikadata.api.modular.appstore.service;

import com.vikadata.api.modular.appstore.model.AppInstance;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfig;
import com.vikadata.entity.AppInstanceEntity;

/**
 * 飞书自建应用服务 接口
 * @author Shawn Deng
 * @date 2021-12-31 17:49:45
 */
public interface ILarkAppInstanceConfigService {

    /**
     * 获取应用实例配置
     * @param appInstanceId 应用实例ID
     * @return LarkInstanceConfig
     */
    LarkInstanceConfig getLarkConfig(String appInstanceId);

    /**
     * 获取应用实例配置
     * @param instanceEntity 应用实例实体
     * @return LarkInstanceConfig
     */
    LarkInstanceConfig getLarkConfig(AppInstanceEntity instanceEntity);

    /**
     * 更新飞书应用实例基础配置
     * @param appInstanceId 应用实例ID
     * @param appKey 用户企业的飞书自建应用ID
     * @param appSecret 飞书自建应用密钥
     * @return AppInstance
     */
    AppInstance updateLarkBaseConfig(String appInstanceId, String appKey, String appSecret);

    /**
     * 更新飞书应用实例事件配置
     * @param appInstanceId 应用实例ID
     * @param eventEncryptKey 事件加密密钥
     * @param eventVerificationToken 事件验证令牌
     * @return AppInstance
     */
    AppInstance updateLarkEventConfig(String appInstanceId, String eventEncryptKey, String eventVerificationToken);

    /**
     * 事件检查完成
     * @param appInstanceId 应用实例ID
     */
    void updateLarkEventCheckStatus(String appInstanceId);

    /**
     * 设置完成状态标识
     * @param appInstanceId 应用实例ID
     */
    void updateLarkConfigCompleteStatus(String appInstanceId);

    /**
     * 同步通讯录状态完成
     * @param appInstanceId 应用实例ID
     */
    void updateLarkContactSyncStatus(String appInstanceId);
}
