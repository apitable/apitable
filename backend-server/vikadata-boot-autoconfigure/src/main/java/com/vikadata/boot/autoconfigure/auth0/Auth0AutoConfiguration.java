package com.vikadata.boot.autoconfigure.auth0;

import java.security.interfaces.RSAPublicKey;

import com.auth0.AuthenticationController;
import com.auth0.exception.PublicKeyProviderException;
import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.auth0.utils.tokens.IdTokenVerifier;
import com.auth0.utils.tokens.SignatureVerifier;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(Auth0Properties.class)
@ConditionalOnClass(AuthenticationController.class)
@ConditionalOnProperty(value = "vikadata-starter.auth0.enabled", havingValue = "true")
public class Auth0AutoConfiguration {

    private final Auth0Properties properties;

    public Auth0AutoConfiguration(Auth0Properties properties) {
        this.properties = properties;
    }

    @Bean
    public Auth0Template auth0Template() {
        String domain = properties.getIssuerUri();
        String clientId = properties.getClientId();
        String clientSecret = properties.getClientSecret();
        String redirectUri = properties.getRedirectUri();
        String dbConnectionId = properties.getDbConnectionId();
        String dbConnectionName = properties.getDbConnectionName();
        JwkProvider provider = new JwkProviderBuilder(domain).build();
        SignatureVerifier signatureVerifier = SignatureVerifier.forRS256(keyId -> {
            try {
                return (RSAPublicKey) provider.get(keyId).getPublicKey();
            }
            catch (JwkException jwke) {
                throw new PublicKeyProviderException("Error obtaining public key", jwke);
            }
        });
        IdTokenVerifier idTokenVerifier = IdTokenVerifier.init(domain, clientId, signatureVerifier).build();
        return new Auth0Template(domain, clientId, clientSecret, redirectUri, dbConnectionId, dbConnectionName, idTokenVerifier);
    }
}
