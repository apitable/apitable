package com.vikadata.api.modular.social.service;

import java.util.List;
import java.util.Set;

import me.chanjar.weixin.cp.bean.WxCpAgent;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.model.vo.social.SocialTenantEnvVo;
import com.vikadata.api.model.vo.social.WeComBindConfigVo;
import com.vikadata.api.modular.social.model.WeComCreateTempConfigResult;
import com.vikadata.social.wecom.model.WeComAuthInfo;

/**
 * <p>
 * 企业微信服务 接口
 * </p>
 *
 * @author Pengap
 * @date 2021/7/31 16:30:54
 */
public interface IWeComService {

    /**
     * 创建临时企业应用授权配置信息
     * <ul>
     *     <li>1.校验应用是否启用</li>
     *     <li>2.通过校验后生成Config Sha</li>
     *     <li>3.会根据spaceId生成域名</li>
     * </ul>
     *
     * @param corpId                   企业ID
     * @param agentId                  企业应用ID
     * @param agentSecret              企业应用密钥
     * @param spaceId                  空间站ID
     * @param isAutoCreateDomain       是否自动生成域名（调用Api生成）
     * @return String                  校验通过后生成对应临时配置文件的 configSha
     * @author Pengap
     * @date 2021/7/31 16:40:46
     */
    WeComCreateTempConfigResult createTempAgentAuthConfig(String corpId, Integer agentId, String agentSecret, String spaceId, boolean isAutoCreateDomain);

    /**
     * 获取缓存中校验通过的授权配置
     *
     * @param configSha 校验通过的企业微信配置sha
     * @return 临时配置对象
     * @author Pengap
     * @date 2021/9/8 18:32:01
     */
    WeComAuthInfo getConfigSha(String configSha);

    /**
     * 移除临时授权配置文件
     *
     * @param configSha 校验通过的企业微信配置sha
     * @return void
     * @author Pengap
     * @date 2021/9/8 18:27:30
     */
    void removeTempConfig(String configSha);

    /**
     * 获取绑定的企业微信应用配置
     *
     * @param spaceId 空间站Id
     * @return 绑定信息
     * @author Pengap
     * @date 2021/8/13 14:47:03
     */
    WeComBindConfigVo getTenantBindWeComConfig(String spaceId);

    /**
     * 根据授权code获取应用成员
     * 同步校验UserId是否在应用授权可见区域
     *
     * @param corpId        企业Id
     * @param agentId       企业应用Id
     * @param code          企业
     * @param isTempAuth    是否使用临时授权Service Api
     * @return 企业微信用户Id
     */
    WxCpUser getWeComUserByOAuth2Code(String corpId, Integer agentId, String code, boolean isTempAuth);

    /**
     * 根据授权code获取应用成员
     * 同步校验UserId是否在应用授权可见区域
     *
     * @param corpId        企业Id
     * @param agentId       企业应用Id
     * @param code          企业
     * @return 企业微信用户
     * @author Pengap
     * @date 2021/8/18 20:02:16
     */
    default WxCpUser getWeComUserByOAuth2Code(String corpId, Integer agentId, String code) {
        return getWeComUserByOAuth2Code(corpId, agentId, code, false);
    }

    /**
     * 根据企业微信UserId获取成员
     *
     * @param corpId        企业Id
     * @param agentId       企业应用Id
     * @param weComUserId   企业微信用户Id
     * @param isTempAuth    是否使用临时授权Service Api
     * @return 企业微信用户
     * @author Pengap
     * @date 2021/8/18 20:02:16
     */
    WxCpUser getWeComUserByWeComUserId(String corpId, Integer agentId, String weComUserId, boolean isTempAuth);

    default WxCpUser getWeComUserByWeComUserId(String corpId, Integer agentId, String weComUserId) {
        return getWeComUserByWeComUserId(corpId, agentId, weComUserId, false);
    }

    /**
     * 企业微信应用绑定空间
     *
     * @param corpId            企业ID
     * @param agentId           企业应用ID
     * @param spaceId           空间ID
     * @param agentConfig       绑定空间的操作授权信息
     * @return 绑定成功的企业微信用户ID
     * @author Pengap
     * @date 2021/8/3 16:17:35
     */
    Set<String> weComAppBindSpace(String corpId, Integer agentId, String spaceId, WeComAuthInfo agentConfig);

    /**
     * 刷新企业微信通讯录
     *
     * @param corpId            企业ID
     * @param agentId           企业应用ID
     * @param spaceId           空间站ID
     * @param operatingUserId   刷新操作用户Id
     * @return 同步的企业微信应用用户ID
     * @author Pengap
     * @date 2021/8/14 16:43:34
     */
    Set<String> weComRefreshContact(String corpId, Integer agentId, String spaceId, Long operatingUserId);

    /**
     * 发送消息
     *
     * @param corpId    企业Id
     * @param agentId   企业应用Id
     * @param spaceId   空间站Id
     * @param toUsers   发送成员列表，为Null = @all
     * @param message   消息体
     * @author Pengap
     * @date 2021/8/6 13:27:25
     */
    void sendMessageToUserPrivate(String corpId, Integer agentId, String spaceId, List<String> toUsers, WxCpMessage message);

    /**
     * 创建固定应用菜单
     *
     * @param corpId    企业Id
     * @param agentId   企业应用Id
     * @param spaceId   空间站Id
     * @author Pengap
     * @date 2021/8/25 14:21:52
     */
    void createFixedMenu(String corpId, Integer agentId, String spaceId);

    /**
     * 获取企业微信应用信息
     *
     * @param corpId        企业Id
     * @param agentId       企业应用Id
     * @param isTempAuth    是否使用临时授权Service Api
     * @return 企业应用信息
     * @author Pengap
     * @date 2021/8/13 18:36:40
     */
    WxCpAgent getCorpAgent(String corpId, Integer agentId, boolean isTempAuth);

    /**
     * 获取企业微信应用信息
     *
     * @param corpId        企业Id
     * @param agentId       企业应用Id
     * @return 企业应用信息
     * @author Pengap
     * @date 2021/8/13 18:36:40
     */
    default WxCpAgent getCorpAgent(String corpId, Integer agentId) {
        return getCorpAgent(corpId, agentId, false);
    }

    /**
     * 获取第三方企业微信集成环境
     *
     * @param requestHost 请求Host
     * @return 第三方租户集成环境
     * @author Pengap
     * @date 2021/8/24 17:39:19
     */
    SocialTenantEnvVo getWeComTenantEnv(String requestHost);

    /**
     * 获取维格表的企业微信显示配置的ID
     *
     * @return 维格表企业微信Id
     * @author Pengap
     * @date 2021/8/25 17:14:15
     */
    String getVikaWeComAppId();

    /**
     * 停用企业微信App
     *
     * @param spaceId 空间站Id
     * @author Pengap
     * @date 2021/8/25 17:23:13
     */
    void stopWeComApp(String spaceId);

}
