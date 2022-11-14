package com.vikadata.api.enterprise.appstore.service;

import com.vikadata.api.enterprise.appstore.model.AppInstance;
import com.vikadata.api.enterprise.appstore.model.LarkInstanceConfig;
import com.vikadata.entity.AppInstanceEntity;

/**
 * Lark self built application service interface
 */
public interface ILarkAppInstanceConfigService {

    /**
     * Get application instance configuration
     *
     * @param appInstanceId Application instance ID
     * @return LarkInstanceConfig
     */
    LarkInstanceConfig getLarkConfig(String appInstanceId);

    /**
     * Get application instance configuration
     *
     * @param instanceEntity Application instance entity
     * @return LarkInstanceConfig
     */
    LarkInstanceConfig getLarkConfig(AppInstanceEntity instanceEntity);

    /**
     * Update the basic configuration of flying book application example
     *
     * @param appInstanceId Application instance ID
     * @param appKey Lark self built application ID of user enterprise
     * @param appSecret Lark self built application key
     * @return AppInstance
     */
    AppInstance updateLarkBaseConfig(String appInstanceId, String appKey, String appSecret);

    /**
     * Update Lark application instance event configuration
     *
     * @param appInstanceId Application instance ID
     * @param eventEncryptKey Event Encryption Key
     * @param eventVerificationToken Event validation token
     * @return AppInstance
     */
    AppInstance updateLarkEventConfig(String appInstanceId, String eventEncryptKey, String eventVerificationToken);

    /**
     * Event check completed
     *
     * @param appInstanceId Application instance ID
     */
    void updateLarkEventCheckStatus(String appInstanceId);

    /**
     * Set completion status ID
     *
     * @param appInstanceId Application instance ID
     */
    void updateLarkConfigCompleteStatus(String appInstanceId);

    /**
     * Synchronization of address book status completed
     *
     * @param appInstanceId Application instance ID
     */
    void updateLarkContactSyncStatus(String appInstanceId);
}
