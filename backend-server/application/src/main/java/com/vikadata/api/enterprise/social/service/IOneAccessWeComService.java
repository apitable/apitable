package com.vikadata.api.enterprise.social.service;

public interface IOneAccessWeComService {

    /**
     * Obtain wecom user identity through OauthCode
     * @param code wecom oauth code
     * @return UserId
     */
    String getUserIdByOAuth2Code(String code);
}
