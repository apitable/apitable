package com.vikadata.integration.idaas;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import com.vikadata.integration.idaas.api.AuthApi;
import com.vikadata.integration.idaas.api.GroupApi;
import com.vikadata.integration.idaas.api.SystemApi;
import com.vikadata.integration.idaas.api.UserApi;
import com.vikadata.integration.idaas.support.ServiceAccount;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * <p>
 * 玉符 IDaaS 请求模板
 * </p>
 * @author 刘斌华
 * @date 2022-05-12 15:20:41
 */
public class IdaasTemplate {

    private final IdaasConfig config;
    private final RestTemplate restTemplate;

    private AuthApi authApi;
    private GroupApi groupApi;
    private SystemApi systemApi;
    private UserApi userApi;

    public IdaasTemplate(IdaasConfig config) {
        this.config = config;
        restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new OkHttp3ClientHttpRequestFactory());

        initApi();
    }

    public IdaasConfig getConfig() {
        return config;
    }

    public AuthApi getAuthApi() {
        return authApi;
    }

    public GroupApi getGroupApi() {
        return groupApi;
    }

    public SystemApi getSystemApi() {
        return systemApi;
    }

    public UserApi getUserApi() {
        return userApi;
    }

    public <T> T get(String url, MultiValueMap<String, Object> payload, Class<T> responseType) throws IdaasApiException {
        return get(url, payload, responseType, null, null, null);
    }

    public <T> T get(String url, MultiValueMap<String, Object> payload, Class<T> responseType, String tenantName, ServiceAccount serviceAccount, String tokenAudience) throws IdaasApiException {
        return execute(url, HttpMethod.GET, payload, responseType, tenantName, serviceAccount, tokenAudience);
    }

    public <T> T post(String url, Object payload, Class<T> responseType) throws IdaasApiException {
        return post(url, payload, responseType, null, null, null);
    }

    public <T> T post(String url, Object payload, Class<T> responseType, String tenantName, ServiceAccount serviceAccount, String tokenAudience) throws IdaasApiException {
        return execute(url, HttpMethod.POST, payload, responseType, tenantName, serviceAccount, tokenAudience);
    }

    public <T> T getFromUrl(String url, HttpHeaders httpHeaders, Class<T> responseType) throws IdaasApiException {
        return execute(url, HttpMethod.GET, httpHeaders, null, responseType);
    }

    public <T> T postFromUrl(String url, HttpHeaders httpHeaders, Object payload, Class<T> responseType) throws IdaasApiException {
        return execute(url, HttpMethod.POST, httpHeaders, payload, responseType);
    }

    private void initApi() {
        this.authApi = new AuthApi(this);
        this.groupApi = new GroupApi(this, config.getContactHost());
        this.systemApi = new SystemApi(this, config.getSystemHost());
        this.userApi = new UserApi(this, config.getContactHost());
    }

    private String getUrl(String url, String tenantName) {
        if (CharSequenceUtil.isBlank(tenantName)) {
            return url;
        } else {
            Dict variables = Dict.create()
                    .set("tenantName", tenantName);

            return StrUtil.format(url, variables);
        }
    }

    /**
     * 执行 API 请求
     *
     * @param url 接口路径
     * @param httpMethod 请求方法
     * @param payload 请求体
     * @param responseType 返回结果类型
     * @param tenantName 操作的租户名。选填
     * @param serviceAccount 请求附带 Token 时需要的 ServiceAccount。选填
     * @param tokenAudience Token 适用的人员，不指定时为空
     * @return 返回结果
     * @throws IdaasApiException 接口请求异常
     * @author 刘斌华
     * @date 2022-05-13 16:40:38
     */
    private  <T> T execute(String url, HttpMethod httpMethod, Object payload,
            Class<T> responseType, String tenantName, ServiceAccount serviceAccount, String tokenAudience) throws IdaasApiException {
        HttpHeaders httpHeaders = new HttpHeaders();
        if (Objects.nonNull(serviceAccount)) {
            try {
                httpHeaders.add("Authorization", "Bearer " + jwtToken(serviceAccount, tokenAudience));
            } catch (JOSEException | ParseException ex) {
                throw new IdaasApiException(ex);
            }
        }

        try {
            HttpEntity<Object> httpEntity;
            UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromUriString(getUrl(url, tenantName));
            if (httpMethod == HttpMethod.GET && payload instanceof MultiValueMap) {
                MultiValueMap<String, ?> multiValueMap = (MultiValueMap<String, ?>) payload;
                for (Map.Entry<String, ?> entry : multiValueMap.entrySet()) {
                    Object value = entry.getValue();
                    if (value instanceof Collection) {
                        uriComponentsBuilder.queryParam(entry.getKey(), (Collection) value);
                    } else {
                        uriComponentsBuilder.queryParam(entry.getKey(), value);
                    }
                }

                httpEntity = new HttpEntity<>(null, httpHeaders);
            } else {
                httpEntity = new HttpEntity<>(payload, httpHeaders);
            }
            ResponseEntity<T> responseEntity =  restTemplate
                    .exchange(uriComponentsBuilder.build().encode(StandardCharsets.UTF_8).toUri(), httpMethod, httpEntity, responseType);
            if (responseEntity.getStatusCode() != HttpStatus.OK) {
                throw new IdaasApiException("IDaaS error, response code: " + responseEntity.getStatusCodeValue());
            }

            return responseEntity.getBody();
        }
        catch (RestClientException ex) {
            throw new IdaasApiException(ex);
        }
    }

    /**
     * 执行全路径请求
     *
     * @param url 接口全路径
     * @param httpMethod 请求方法
     * @param httpHeaders 请求头
     * @param payload 请求体
     * @param responseType 返回结果类型
     * @return 返回结果
     * @throws IdaasApiException 接口请求异常
     * @author 刘斌华
     * @date 2022-05-13 16:40:38
     */
    private  <T> T execute(String url, HttpMethod httpMethod, HttpHeaders httpHeaders, Object payload, Class<T> responseType) throws IdaasApiException {
        try {
            HttpEntity<Object> httpEntity = new HttpEntity<>(payload, httpHeaders);
            ResponseEntity<T> responseEntity =  restTemplate
                    .exchange(url, httpMethod, httpEntity, responseType);
            if (responseEntity.getStatusCode() != HttpStatus.OK) {
                throw new IdaasApiException("IDaaS error, response code: " + responseEntity.getStatusCodeValue());
            }

            return responseEntity.getBody();
        }
        catch (RestClientException ex) {
            throw new IdaasApiException(ex);
        }
    }

    /**
     * 生成接口请求的 JWT Token
     *
     * @param serviceAccount 服务商账户信息
     * @param audience token 适用的用户名称，没有则为空
     * @return JWT Token
     * @author 刘斌华
     * @date 2022-05-12 18:29:35
     */
    private String jwtToken(ServiceAccount serviceAccount, String audience) throws JOSEException, ParseException {
        ServiceAccount.PrivateKey privateKey = serviceAccount.getPrivateKey();
        JWSHeader jwsHeader = new JWSHeader.Builder(JWSAlgorithm.RS256)
                .type(JOSEObjectType.JWT)
                .keyID(privateKey.getKid())
                .build();

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .issueTime(Date.from(Instant.now()))
                .expirationTime(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
                .audience(audience)
                .issuer(serviceAccount.getClientId())
                .claim("account_type", "serviceAccount")
                .build();

        SignedJWT jwt = new SignedJWT(jwsHeader, claimsSet);

        RSAKey rsaKey = RSAKey.parse(privateKey.toMap());
        JWSSigner signer = new RSASSASigner(rsaKey);
        jwt.sign(signer);

        return jwt.serialize();
    }

}
