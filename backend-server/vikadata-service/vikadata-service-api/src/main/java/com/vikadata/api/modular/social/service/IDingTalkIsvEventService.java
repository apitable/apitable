package com.vikadata.api.modular.social.service;

import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;
import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.BaseOrgUserContactEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserLeaveOrgEvent;

/**
 * <p> 
 * ISV钉钉事件服务接口
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/14 3:37 下午
 */
public interface IDingTalkIsvEventService {
    /**
     * 处理钉钉企业授权事件
     *
     * @param suiteId 套件ID
     * @param event 授权事件
     * @author zoe zheng
     * @date 2021/9/13 2:41 下午
     */
    void handleOrgSuiteAuthEvent(String suiteId, BaseOrgSuiteEvent event);

    /**
     * 处理钉钉授权变更事件
     *
     * @param suiteId 套件ID
     * @param event 授权事件
     * @author zoe zheng
     * @date 2021/9/18 14:31
     */
    void handleOrgSuiteChangeEvent(String suiteId, BaseOrgSuiteEvent event);

    /**
     * 处理钉钉企业解除授权
     *
     * @param suiteId 套件ID
     * @param corpId 授权企业ID
     * @author zoe zheng
     * @date 2021/9/13 2:41 下午
     */
    void handleOrgSuiteRelieveEvent(String suiteId, String corpId);

    /**
     * 处理钉钉应用启用事件
     * 因为这个事件只能是后台操作，所以之前一定是后台手动停用了
     *
     * @param suiteId 套件ID
     * @param corpId 授权企业ID
     * @author zoe zheng
     * @date 2021/9/13 2:41 下午
     */
    void handleOrgMicroAppRestoreEvent(String suiteId, String corpId);

    /**
     * 处理钉钉应用停用事件，这个事件只能是后台操作，并且可以重新启用，所以不删除用户信息
     *
     * @param suiteId 套件ID
     * @param corpId 授权企业ID
     * @author zoe zheng
     * @date 2021/9/13 2:41 下午
     */
    void handleOrgMicroAppStopEvent(String suiteId, String corpId);

    /**
     * 处理用户加入企业
     *
     * @param openId 用户ID
     * @param event 事件
     * @author zoe zheng
     * @date 2021/9/22 10:24
     */
    void handleUserAddOrgEvent(String openId, BaseOrgUserContactEvent event);

    /**
     * 处理用户离开企业
     *
     * @param openId 用户ID
     * @param event 事件
     * @author zoe zheng
     * @date 2021/9/22 13:53
     */
    void handleUserLeaveOrgEvent(String openId, SyncHttpUserLeaveOrgEvent event);

    /**
     * 处理应用市场下单信息
     *
     * @param event 订单信息
     * @author zoe zheng
     * @date 2021/10/26 12:04
     */
    void handleMarketOrderEvent(SyncHttpMarketOrderEvent event);

    /**
     *  处理订单关闭事件
     *
     * @param event 退订订单信息
     * @author zoe zheng
     * @date 2021/10/27 14:35
     */
    void handleMarketServiceClosedEvent(SyncHttpMarketServiceCloseEvent event);
}
