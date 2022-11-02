package com.vikadata.api.modular.social.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialFeishuEventLogEntity;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * Third party platform integration - Mark event log service interface
 */
public interface ISocialFeishuEventLogService extends IService<SocialFeishuEventLogEntity> {

    /**
     * Event processing completed
     *
     * @param uuid Event Unique ID
     */
    void doneEvent(String uuid);

    /**
     * Create event record
     *
     * @param event Event
     */
    <T extends BaseEvent> boolean create(T event);

    /**
     * Create event record
     * New Address Book Event
     *
     * @param event Event
     */
    <T extends BaseV3ContactEvent> boolean createV3ContactEventLog(T event);
}
