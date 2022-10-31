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
 * WeCom service interface
 * </p>
 */
public interface IWeComService {

    /**
     * Create temporary enterprise application authorization configuration information
     * <ul>
     *     <li>1.Verify whether the application is enabled</li>
     *     <li>2.Generate Config Sha after verification</li>
     *     <li>3.Domain name will be generated according to space Id</li>
     * </ul>
     *
     * @param corpId                   Enterprise ID
     * @param agentId                  Enterprise App ID
     * @param agentSecret              Enterprise Application Key
     * @param spaceId                  Space ID
     * @param isAutoCreateDomain       Whether to automatically generate the domain name (call Api to generate)
     * @return String                  Generate configSha of corresponding temporary configuration file after verification
     */
    WeComCreateTempConfigResult createTempAgentAuthConfig(String corpId, Integer agentId, String agentSecret, String spaceId, boolean isAutoCreateDomain);

    /**
     * Get the authorization configuration that passed the verification in the cache
     *
     * @param configSha WeCom configuration sha after verification
     * @return Temporary configuration object
     */
    WeComAuthInfo getConfigSha(String configSha);

    /**
     * Remove temporary authorization profile
     *
     * @param configSha WeCom configuration sha after verification
     * @return void
     */
    void removeTempConfig(String configSha);

    /**
     * Get the bound WeCom application configuration
     *
     * @param spaceId Space ID
     * @return Binding information
     */
    WeComBindConfigVo getTenantBindWeComConfig(String spaceId);

    /**
     * Obtain application members according to authorization code
     * Synchronously verify whether the User ID is in the application authorization visible area
     *
     * @param corpId        Enterprise ID
     * @param agentId       Enterprise App ID
     * @param code          Enterprise
     * @param isTempAuth    Whether to use temporary authorization Service Api
     * @return WeCom UserId
     */
    WxCpUser getWeComUserByOAuth2Code(String corpId, Integer agentId, String code, boolean isTempAuth);

    /**
     * Obtain application members according to authorization code
     * Synchronously verify whether the User ID is in the application authorization visible area
     *
     * @param corpId        Enterprise ID
     * @param agentId       Enterprise App ID
     * @param code          Enterprise
     * @return WeCom Users
     */
    default WxCpUser getWeComUserByOAuth2Code(String corpId, Integer agentId, String code) {
        return getWeComUserByOAuth2Code(corpId, agentId, code, false);
    }

    /**
     * Get members according to WeCom UserId
     *
     * @param corpId        Enterprise ID
     * @param agentId       Enterprise App ID
     * @param weComUserId   WeCom UserId
     * @param isTempAuth    Whether to use temporary authorization Service Api
     * @return WeCom Users
     */
    WxCpUser getWeComUserByWeComUserId(String corpId, Integer agentId, String weComUserId, boolean isTempAuth);

    default WxCpUser getWeComUserByWeComUserId(String corpId, Integer agentId, String weComUserId) {
        return getWeComUserByWeComUserId(corpId, agentId, weComUserId, false);
    }

    /**
     * WeCom application binding space
     *
     * @param corpId            Enterprise ID
     * @param agentId           Enterprise App ID
     * @param spaceId           Space ID
     * @param agentConfig       Operation authorization information of the binding space
     * @return WeCom user ID successfully bound
     */
    Set<String> weComAppBindSpace(String corpId, Integer agentId, String spaceId, WeComAuthInfo agentConfig);

    /**
     * Refresh WeCom Address Book
     *
     * @param corpId            Enterprise ID
     * @param agentId           Enterprise App ID
     * @param spaceId           Space ID
     * @param operatingUserId   Refresh operation user ID
     * @return Synchronized WeCom application user ID
     */
    Set<String> weComRefreshContact(String corpId, Integer agentId, String spaceId, Long operatingUserId);

    /**
     * Send message
     *
     * @param corpId    Enterprise ID
     * @param agentId   Enterprise App ID
     * @param spaceId   Space ID
     * @param toUsers   Send member list for Null = @all
     * @param message   Message body
     */
    void sendMessageToUserPrivate(String corpId, Integer agentId, String spaceId, List<String> toUsers, WxCpMessage message);

    /**
     * Create fixed application menu
     *
     * @param corpId    Enterprise ID
     * @param agentId   Enterprise App ID
     * @param spaceId   Space ID
     */
    void createFixedMenu(String corpId, Integer agentId, String spaceId);

    /**
     * Get WeCom application information
     *
     * @param corpId        Enterprise ID
     * @param agentId       Enterprise App ID
     * @param isTempAuth    Whether to use temporary authorization Service Api
     * @return Enterprise Application Information
     */
    WxCpAgent getCorpAgent(String corpId, Integer agentId, boolean isTempAuth);

    /**
     * Get WeCom application information
     *
     * @param corpId        Enterprise ID
     * @param agentId       Enterprise App ID
     * @return Enterprise Application Information
     */
    default WxCpAgent getCorpAgent(String corpId, Integer agentId) {
        return getCorpAgent(corpId, agentId, false);
    }

    /**
     * Get the third-party WeCom integrated environment
     *
     * @param requestHost Request Host
     * @return Third party tenant integration environment
     */
    SocialTenantEnvVo getWeComTenantEnv(String requestHost);

    /**
     * Get the ID of vika's We Com display configuration
     *
     * @return vika WeCom Id
     */
    String getVikaWeComAppId();

    /**
     * Deactivate WeCom App
     *
     * @param spaceId Space ID
     */
    void stopWeComApp(String spaceId);

}
