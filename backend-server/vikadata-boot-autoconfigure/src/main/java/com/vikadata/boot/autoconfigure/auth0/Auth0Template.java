package com.vikadata.boot.autoconfigure.auth0;

import com.auth0.Tokens;
import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.TokenHolder;
import com.auth0.net.AuthRequest;
import com.auth0.utils.tokens.IdTokenVerifier;

/**
 * @author Shawn Deng
 */
public class Auth0Template {

    private final AuthAPI authAPI;

    private final ManagementAPI managementAPI;

    private final String clientId;

    private final String redirectUri;

    private final IdTokenVerifier tokenVerifier;

    public Auth0Template(String domain, String clientId, String clientSecret, String redirectUri, IdTokenVerifier tokenVerifier) {
        authAPI = new AuthAPI(domain, clientId, clientSecret);
        AuthRequest authRequest = authAPI.requestToken(domain + "api/v2/");
        TokenHolder holder;
        try {
            holder = authRequest.execute();
        }
        catch (Auth0Exception e) {
            throw new IllegalStateException("can't initial auth0 management api instance", e);
        }
        managementAPI = new ManagementAPI(domain, holder.getAccessToken());
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.tokenVerifier = tokenVerifier;
    }

    public String buildAuthorizeUrl() {
        return authAPI.authorizeUrl(redirectUri)
                .withScope("openid profile email")
                .build();
    }

    public String buildLogoutUrl(String returnToUrl) {
        return authAPI.logoutUrl(returnToUrl, true)
                .useFederated(true)
                .build();
    }

    public Tokens getVerifiedTokens(String authorizationCode, String redirectUri) throws Auth0Exception {
        Tokens codeExchangeTokens = exchangeCodeForTokens(authorizationCode, redirectUri);
        String idTokenFromCodeExchange = codeExchangeTokens.getIdToken();
        if (idTokenFromCodeExchange != null) {
            tokenVerifier.verify(idTokenFromCodeExchange);
        }
        return codeExchangeTokens;
    }

    public Tokens exchangeCodeForTokens(String authorizationCode, String redirectUri) throws Auth0Exception {
        TokenHolder holder = authAPI
                .exchangeCode(authorizationCode, redirectUri)
                .execute();
        return new Tokens(holder.getAccessToken(), holder.getIdToken(), holder.getRefreshToken(), holder.getTokenType(), holder.getExpiresIn());
    }

    public String getRedirectUri() {
        return redirectUri;
    }
}
