package com.vikadata.social.qq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.qq.model.AccessTokenInfo;
import com.vikadata.social.qq.model.TencentUserInfo;
import com.vikadata.social.qq.model.WebAppAuthInfo;

import org.springframework.web.client.RestTemplate;

/**
 * <p>
 * QQ互联-网站应用 授权相关服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/10/16
 */
public class AuthTemplate extends AbstractQQOperations implements AuthOperations {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthTemplate.class);

    private final AppConfig appConfig;

    public AuthTemplate(AppConfig appConfig, RestTemplate restTemplate) {
        super(restTemplate);
        this.appConfig = appConfig;
    }

    @Override
    public AccessTokenInfo getAccessToken(String code) throws QQException {
        LOGGER.info("获取授权令牌信息，code:{}", code);
        String url = "https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=%s&client_secret=%s&code=%s&redirect_uri=%s&fmt=json";
        String formatUrl = String.format(url, appConfig.getAppId(), appConfig.getAppKey(), code, appConfig.getRedirectUri());
        LOGGER.info("授权请求地址：{}", formatUrl);
        return doGet(formatUrl, AccessTokenInfo.class);
    }

    @Override
    public WebAppAuthInfo getAuthInfo(String accessToken) throws QQException {
        LOGGER.info("获取 QQ 授权用户的应用ID信息，accessToken:{}", accessToken);
        int isApplyUnionId = appConfig.getApplyUnion() ? 1 : 0;
        String formatUrl = String.format("https://graph.qq.com/oauth2.0/me?access_token=%s&unionid=%s&fmt=json", accessToken, isApplyUnionId);
        LOGGER.info("请求地址：{}", formatUrl);
        return doGet(formatUrl, WebAppAuthInfo.class);
    }

    @Override
    public TencentUserInfo getTencentUserInfo(String accessToken, String clientId, String openId) throws QQException {
        LOGGER.info("获取 QQ 用户信息，accessToken:{}, clientId:{}, openId:{}", accessToken, clientId, openId);
        String url = "https://graph.qq.com/user/get_user_info?access_token=%s&oauth_consumer_key=%s&openid=%s";
        String formatUrl = String.format(url, accessToken, clientId, openId);
        LOGGER.info("请求地址：{}", formatUrl);
        return doGet(formatUrl, TencentUserInfo.class);
    }
}
