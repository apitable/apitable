package com.apitable.starter.auth0.core;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.auth0.Tokens;
import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.TokenHolder;
import com.auth0.json.mgmt.tickets.PasswordChangeTicket;
import com.auth0.json.mgmt.users.User;
import com.auth0.net.AuthRequest;
import com.auth0.utils.tokens.IdTokenVerifier;

public class Auth0Template {

    private final AuthAPI authAPI;

    private ManagementAPI managementAPI;

    private final String domain;

    private final String clientId;

    private final String redirectUri;

    private final String dbConnectionId;

    private final String dbConnectionName;

    private final IdTokenVerifier tokenVerifier;

    private ScheduledExecutorService scheduled = Executors.newScheduledThreadPool(1);

    public Auth0Template(String domain, String clientId, String clientSecret, String redirectUri, String dbConnectionId, String dbConnectionName, IdTokenVerifier tokenVerifier) {
        authAPI = new AuthAPI(domain, clientId, clientSecret);
        this.domain = domain;
        refreshManagementAPIToken();
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.dbConnectionId = dbConnectionId;
        this.dbConnectionName = dbConnectionName;
        this.tokenVerifier = tokenVerifier;
        scheduled.scheduleAtFixedRate(this::refreshManagementAPIToken, 10, 1, TimeUnit.HOURS);
    }

    private void refreshManagementAPIToken() {
        AuthRequest authRequest = authAPI.requestToken(domain + "api/v2/");
        TokenHolder holder;
        try {
            holder = authRequest.execute();
        }
        catch (Auth0Exception e) {
            throw new IllegalStateException("can't initial auth0 management api instance", e);
        }
        this.managementAPI = new ManagementAPI(domain, holder.getAccessToken());
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

    public User usersByEmail(String email) throws Auth0Exception {
        List<User> users = managementAPI.users().listByEmail(email, null).execute();
        if (users != null && users.size() > 0) {
            return users.iterator().next();
        }
        return null;
    }

    public String createUser(String email, boolean sendVerifyEmail) throws Auth0Exception {
        User request = new User();
        request.setEmail(email);
        request.setPassword(UUID.randomUUID().toString().toCharArray());
        request.setVerifyEmail(sendVerifyEmail);
        request.setConnection(dbConnectionName);
        User user = managementAPI.users().create(request).execute();
        return user.getId();
    }

    public String createPasswordResetTicket(String userId, String returnUrl) throws Auth0Exception {
        PasswordChangeTicket request = new PasswordChangeTicket(userId);
        request.setResultUrl(returnUrl);
        request.setIncludeEmailInRedirect(true);
        request.setMarkEmailAsVerified(true);
        PasswordChangeTicket ticket = managementAPI.tickets().requestPasswordChange(request)
                .execute();
        return ticket.getTicket();
    }

    public String getRedirectUri() {
        return redirectUri;
    }
}
