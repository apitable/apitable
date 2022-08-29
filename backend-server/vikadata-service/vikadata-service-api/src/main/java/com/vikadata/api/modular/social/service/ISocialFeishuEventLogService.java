package com.vikadata.api.modular.social.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialFeishuEventLogEntity;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * 第三方平台集成-飞书事件日志 服务接口
 *
 * @author Shawn Deng
 * @date 2020-12-14 19:49:26
 */
public interface ISocialFeishuEventLogService extends IService<SocialFeishuEventLogEntity> {

    /**
     * 事件处理完成
     *
     * @param uuid 事件唯一ID
     * @author Shawn Deng
     * @date 2020/12/16 14:47
     */
    void doneEvent(String uuid);

    /**
     * 创建事件记录
     *
     * @param event 事件
     * @author Shawn Deng
     * @date 2020/12/14 19:55
     * @return
     */
    <T extends BaseEvent> boolean create(T event);

    /**
     * 创建事件记录
     * 新版通讯录事件
     *
     * @param event 事件
     * @author Shawn Deng
     * @date 2020/12/14 19:55
     * @return
     */
    <T extends BaseV3ContactEvent> boolean createV3ContactEventLog(T event);
}
