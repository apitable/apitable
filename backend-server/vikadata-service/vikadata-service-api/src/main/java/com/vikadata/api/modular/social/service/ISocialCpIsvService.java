package com.vikadata.api.modular.social.service;

import com.vikadata.api.modular.social.model.WeComIsvJsSdkAgentConfigVo;
import com.vikadata.api.modular.social.model.WeComIsvJsSdkConfigVo;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.social.wecom.model.WxCpIsvPermanentCodeInfo;

import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearchResp;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import java.util.List;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商
 * </p>
 * @author 刘斌华
 * @date 2022-01-12 11:38:49
 */
public interface ISocialCpIsvService {

    /**
     * 刷新 access_token，不强制刷新
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 企业 ID
     * @param permanentCode 企业永久授权码
     * @author 刘斌华
     * @date 2022-01-17 19:07:14
     */
    void refreshAccessToken(String suiteId, String authCorpId, String permanentCode);

    /**
     * 刷新 access_token
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 企业 ID
     * @param permanentCode 企业永久授权码
     * @param forceRefresh 是否强制刷新
     * @author 刘斌华
     * @date 2022-01-17 19:07:14
     */
    void refreshAccessToken(String suiteId, String authCorpId, String permanentCode, boolean forceRefresh);

    /**
     * 获取 JS-SDK 校验企业身份与权限的配置参数
     *
     * @param socialTenantEntity 企微绑定的租户信息
     * @param url 当前网页的 URL，不包含 # 及其后面部分
     * @return JS-SDK 校验企业身份与权限的配置参数
     * @author 刘斌华
     * @date 2022-03-10 16:17:05
     */
    WeComIsvJsSdkConfigVo getJsSdkConfig(SocialTenantEntity socialTenantEntity, String url) throws WxErrorException;

    /**
     * 获取 JS-SDK 校验应用身份与权限的配置参数
     *
     * @param socialTenantEntity 企微绑定的租户信息
     * @param url 当前网页的 URL，不包含 # 及其后面部分
     * @return JS-SDK 校验企业身份与权限的配置参数
     * @author 刘斌华
     * @date 2022-03-10 16:17:05
     */
    WeComIsvJsSdkAgentConfigVo getJsSdkAgentConfig(SocialTenantEntity socialTenantEntity, String url) throws WxErrorException;

    /**
     * 根据永久授权信息创建租户
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param permanentCodeInfo 永久授权信息
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-03-15 18:55:52
     */
    void createAuthFromPermanentInfo(String suiteId, String authCorpId, WxCpIsvPermanentCodeInfo permanentCodeInfo) throws WxErrorException;

    /**
     * 为删除了空间站的租户创建新的空间站
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权企业的 ID
     * @author 刘斌华
     * @date 2022-06-16 14:09:33
     */
    void createNewSpace(String suiteId, String authCorpId);

    /**
     * 判断用户是否在应用的可见范围内
     *
     * <p>
     * 需要清空临时缓存
     * </p>
     *
     * @param corpId 企业 ID
     * @param cpUserId 用户的 ID
     * @param suiteId 应用套件 ID
     * @param allowUsers 企业微信可见用户
     * @param allowParties 企业微信可见部门
     * @param allowTags 企业微信可见标签
     * @return 用户是否在应用的可见范围内
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-01-07 14:40:26
     */
    boolean judgeViewable(String corpId, String cpUserId, String suiteId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException;

    /**
     * 根据规则判断为空间站创建并绑定主管理员
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param authCpUserId 操作授权的企微用户 ID
     * @param agentId 安装后的应用 ID
     * @param authMode 授权模式
     * @param spaceId 空间站 ID
     * @param allowUsers 可见的用户列表
     * @param allowParties 可见的部门列表
     * @param allowTags 可见的标签列表
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-03-10 15:00:52
     */
    void bindSpaceAdmin(String suiteId, String authCorpId, String authCpUserId,
            Integer agentId, Integer authMode, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException;

    /**
     * 同步所有可见成员
     *
     * <p>
     * 需要清空临时缓存
     * </p>
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 空间站 ID
     * @param allowUsers 企业微信可见用户
     * @param allowParties 企业微信可见部门
     * @param allowTags 企业微信可见标签
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-01-07 18:28:34
     */
    void syncViewableUsers(String suiteId, String authCorpId, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException;

    /**
     * 同步单个成员
     *
     * <p>
     * 需要清空临时缓存
     * </p>
     *
     * @param corpId 企业 ID
     * @param cpUserId 授权管理员（成员）的 ID
     * @param suiteId 应用套件 ID
     * @param spaceId 空间站
     * @param isAdmin 是否将该用户设置为主管理员
     * @author 刘斌华
     * @date 2022-01-06 18:49:56
     */
    void syncSingleUser(String corpId, String cpUserId, String suiteId, String spaceId, boolean isAdmin);

    /**
     * 清空授权企业在通讯录操作时的所有临时缓存
     *
     * @param authCorpId 授权企业的 ID
     * @author 刘斌华
     * @date 2022-01-18 16:44:07
     */
    void clearCache(String authCorpId);

    /**
     * 发送开始使用消息
     *
     * @param socialTenantEntity 租户信息
     * @param spaceId 空间站 ID
     * @param wxCpMessage 消息体
     * @param toUsers 接收的用户
     * @param toParties 接收的部门
     * @param toTags 接收的标签
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-01-21 14:52:09
     */
    void sendWelcomeMessage(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage,
            List<String> toUsers, List<Integer> toParties, List<Integer> toTags) throws WxErrorException;

    /**
     * 对新增成员缓存列表中的用户发送开始使用消息
     *
     * @param socialTenantEntity 租户信息
     * @param spaceId 空间站 ID
     * @param wxCpMessage 消息体
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-02-18 11:54:46
     */
    void sendWelcomeMessage(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage) throws WxErrorException;

    /**
     * 发送消息给指定用户
     *
     * @param socialTenantEntity 租户信息
     * @param spaceId 空间站 ID
     * @param wxCpMessage 消息体
     * @param toUsers 接收的用户
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-01-21 18:53:45
     */
    void sendMessageToUser(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage,
            List<String> toUsers) throws WxErrorException;

    /**
     * 发送模板消息给指定用户
     *
     * @param socialTenantEntity 租户信息
     * @param spaceId 空间站 ID
     * @param wxCpMessage 消息体
     * @param toUsers 接收的用户
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-01-21 18:53:45
     */
    void sendTemplateMessageToUser(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage,
            List<String> toUsers) throws WxErrorException;

    /**
     * 模糊搜索用户或者部门
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param agentId 授权后的应用 ID
     * @param keyword 搜索关键词
     * @param type 搜索类型，为空则查询所有。1：用户；2：部门
     * @return 匹配的用户或者部门
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-04-12 11:35:22
     */
    WxCpTpContactSearchResp.QueryResult search(String suiteId, String authCorpId, Integer agentId, String keyword, Integer type) throws WxErrorException;

    /**
     * handle wecom paid subscription for existed order
     *
     * @param spaceId Vika space ID
     * @param orderEntity Existed order info
     * @author Codeman
     * @date 2022-08-29 16:53:52
     */
    void handleTenantPaidSubscribe(String spaceId, SocialWecomOrderEntity orderEntity);

    /**
     * handle wecom paid subscription
     *
     * @param suiteId Wecom isv suite ID
     * @param authCorpId Paid corporation ID
     * @param spaceId Optionally, vika space ID
     * @param orderId The order ID of wecom isv paid subscription
     * @throws WxErrorException Exception occurred while fetching wecom order info
     * @author Codeman
     * @date 2022-05-05 17:52:23
     */
    void handleTenantPaidSubscribe(String suiteId, String authCorpId, String spaceId, String orderId) throws WxErrorException;

    /**
     * handle wecom trial subscription
     *
     * @param suiteId Wecom isv suite ID
     * @param authCorpId Paid corporation ID
     * @param editionId Wecom paid edition ID
     * @param orderType Wecom order type. 0: new order; 1：expand volume; 2: renew period; 3: change edition
     * @param expiredTime Optionally, expired time for trial. ms
     * @author Codeman
     * @date 2022-08-26 18:52:23
     */
    void handleTenantTrialSubscribe(String suiteId, String authCorpId, String editionId, Integer orderType, Long expiredTime);

}
