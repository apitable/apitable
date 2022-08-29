package com.vikadata.api.modular.appstore.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.model.AppInstance;
import com.vikadata.api.modular.appstore.model.InstanceConfig;
import com.vikadata.entity.AppInstanceEntity;
import com.vikadata.social.feishu.config.FeishuConfigStorage;

/**
 * 应用实例服务
 * @author Shawn Deng
 * @date 2022-01-17 15:23:27
 */
public interface IAppInstanceService extends IService<AppInstanceEntity> {

    /**
     * 获取空间的应用实例
     * @param spaceId 空间ID
     * @return AppInstanceEntity List
     */
    List<AppInstanceEntity> getAppInstances(String spaceId);

    /**
     * 根据实例ID获取应用实例
     * @param appInstanceId 实例ID
     * @return AppInstanceEntity
     */
    AppInstanceEntity getByAppInstanceId(String appInstanceId);

    /**
     * 是否存在应用实例配置的应用key
     * @param appInstanceId 应用实例ID
     * @param appKey 应用实例KEY
     * @return true | false
     */
    boolean isAppInstanceAppKeyExist(String appInstanceId, String appKey);

    /**
     * 是否存在应用实例配置的应用key
     * @param appKey 应用实例KEY
     * @return true | false
     */
    boolean isAppKeyExist(String appKey);

    /**
     * 获取应用实例
     * @param spaceId 空间ID
     * @param appId 应用ID
     * @return AppInstanceEntity
     */
    AppInstanceEntity getBySpaceIdAndAppId(String spaceId, String appId);

    /**
     * 获取空间指定类型的应用实例
     * @param spaceId 空间ID
     * @param appType 应用类型
     * @return AppInstanceEntity
     */
    AppInstanceEntity getInstanceBySpaceIdAndAppType(String spaceId, AppType appType);

    /**
     * 根据应用实例ID构建配置存储器
     * @param appInstanceId 应用实例ID
     * @return 应用配置存储
     */
    FeishuConfigStorage buildConfigStorageByInstanceId(String appInstanceId);

    /**
     * 兼容应用市场数据
     * @param spaceId 空间ID
     */
    void compatibleMarketPlace(String spaceId);

    /**
     * 检查指定应用类型的应用是否已开通
     * @param spaceId 空间ID
     * @param appType 应用类型
     * @return true | false
     */
    boolean checkInstanceExist(String spaceId, String appType);

    /**
     * 获取应用实例列表
     * @param spaceId 空间ID
     * @return AppInstance List
     */
    List<AppInstance> getAppInstancesBySpaceId(String spaceId);

    /**
     * 根据实例ID获取应用实例视图
     * @param appInstanceId 应用实例ID
     * @return AppInstance
     */
    AppInstance getAppInstance(String appInstanceId);

    /**
     * 创建指定类型的应用实例
     * @param spaceId 空间ID
     * @param appType 应用类型
     */
    void createInstanceByAppType(String spaceId, String appType);

    /**
     * 创建应用实例
     * @param spaceId 空间ID
     * @param appId 应用ID
     * @return AppInstance
     */
    AppInstance createInstance(String spaceId, String appId);

    /**
     * 创建应用实例
     * @param spaceId 空间ID
     * @param appId 应用ID
     * @return AppInstance
     */
    AppInstance create(String spaceId, String appId);

    /**
     * 更新应用实例配置
     * @param appInstanceId 应用实例ID
     * @param config 应用实例配置
     * @return AppInstance
     */
    AppInstance updateAppInstanceConfig(String appInstanceId, InstanceConfig config);

    /**
     * 更改应用实例状态
     * @param appInstanceId 应用实例ID
     * @param isEnabled 是否开启
     */
    void updateAppInstanceStatus(String appInstanceId, boolean isEnabled);

    /**
     * 删除应用实例
     * @param userId 用户ID
     * @param appInstanceId 应用实例ID
     */
    void deleteAppInstance(Long userId, String appInstanceId);

    /**
     * 删除空间指定类型的应用
     * @param spaceId 空间ID
     * @param appType 应用类型
     */
    void deleteBySpaceIdAndAppType(String spaceId, String appType);

    /**
     * 构建应用实例视图
     * @param instanceEntity 实例实体类
     * @return AppInstance
     */
    AppInstance buildInstance(AppInstanceEntity instanceEntity);
}
