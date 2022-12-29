package com.vikadata.social.qq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.qq.model.AccessTokenInfo;
import com.vikadata.social.qq.model.TencentUserInfo;
import com.vikadata.social.qq.model.WebAppAuthInfo;

import org.springframework.web.client.RestTemplate;

/**
 * QQ Website Application Authorization-related service implementation class
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
        LOGGER.info("get QQ access toke, code:{}", code);
        String url = "https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=%s&client_secret=%s&code=%s&redirect_uri=%s&fmt=json";
        String formatUrl = String.format(url, appConfig.getAppId(), appConfig.getAppKey(), code, appConfig.getRedirectUri());
        LOGGER.info("QQ authorization request url:{}", formatUrl);
        return doGet(formatUrl, AccessTokenInfo.class);
    }

    @Override
    public WebAppAuthInfo getAuthInfo(String accessToken) throws QQException {
        LOGGER.info("get QQ authorization web app info, accessToken:{}", accessToken);
        int isApplyUnionId = appConfig.getApplyUnion() ? 1 : 0;
        String formatUrl = String.format("https://graph.qq.com/oauth2.0/me?access_token=%s&unionid=%s&fmt=json", accessToken, isApplyUnionId);
        LOGGER.info("QQ authorization web app info request url: {}", formatUrl);
        return doGet(formatUrl, WebAppAuthInfo.class);
    }

    @Override
    public TencentUserInfo getTencentUserInfo(String accessToken, String clientId, String openId) throws QQException {
        LOGGER.info("get QQ user info, accessToken:{}, clientId:{}, openId:{}", accessToken, clientId, openId);
        String url = "https://graph.qq.com/user/get_user_info?access_token=%s&oauth_consumer_key=%s&openid=%s";
        String formatUrl = String.format(url, accessToken, clientId, openId);
        LOGGER.info("QQ user info request url: {}", formatUrl);
        return doGet(formatUrl, TencentUserInfo.class);
    }
}
