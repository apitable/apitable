package com.apitable.starter.connector;

import java.time.Clock;
import java.util.HashMap;
import java.util.Map;

import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.apitable.starter.connector.k11.core.ApiBinding;
import com.apitable.starter.connector.k11.core.BaseResponse;
import com.apitable.starter.connector.k11.model.EncryptKey;
import com.apitable.starter.connector.k11.model.SsoAuthInfo;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClientException;

/**
 * <p>
 * K11 Connections Implementation Class
 * </p>
 */
public class K11Template extends ApiBinding implements K11Connector {

    private static final Logger LOGGER = LoggerFactory.getLogger(K11Template.class);

    private static final Integer DEFAULT_SUCCESS_CODE = 200;

    private static final String ENCRYPT_KEY_URL = "/common/encrypt-key";

    private static final String SSO_AUTH_URL = "/sso/auth";

    private static final String SSO_SYNC_LOGIN_URL = "/sso/sync-login";

    private static final String SMS_URL = "/sms/send";

    private final String domain;

    private final String appId;

    private final String appSecret;

    private final String smsTempCode;

    public K11Template(String domain, String appId, String appSecret, String smsTempCode) {
        this.domain = domain;
        this.appId = appId;
        this.appSecret = appSecret;
        this.smsTempCode = smsTempCode;
    }

    @Override
    public SsoAuthInfo loginBySsoToken(String token){
        LOGGER.info("K11: Login by Sso sync-login, token:{}", token);
        HttpHeaders header = this.getHeader();
        try {
            Map<String, Object> map = new HashMap<>(3);
            map.put("token", token);
            BaseResponse res = getRestTemplate().postForObject(this.domain + SSO_SYNC_LOGIN_URL,
                new HttpEntity<>(map, header), BaseResponse.class);
            assert res != null;
            if (!res.getCode().equals(DEFAULT_SUCCESS_CODE)) {
                throw new RuntimeException("Sso sync-login certificate failure! Msg: " + res.getMsg());
            }
            return JSONUtil.parse(res.getData()).toBean(SsoAuthInfo.class);
        } catch (RestClientException e) {
            throw new RestClientException("Sso sync-login certificate request error! Msg: " + e.getMessage());
        }
    }

    @Override
    public SsoAuthInfo loginBySso(String email, String password) {
        LOGGER.info("K11: Login by Sso, email:{}", email);
        HttpHeaders header = this.getHeader();
        EncryptKey encryptKey = this.getEncryptKey(header);
        try {
            Map<String, Object> map = new HashMap<>(3);
            map.put("email", email);
            // AES-256-CBC encryption
            AesEncryption aes = new AesEncryption("CBC", 256);
            map.put("password", new String(aes.encrypt(password, encryptKey.getEncryptKey())));
            map.put("ticket", encryptKey.getTicket());
            BaseResponse res = getRestTemplate().postForObject(this.domain + SSO_AUTH_URL,
                    new HttpEntity<>(map, header), BaseResponse.class);
            assert res != null;
            if (!res.getCode().equals(DEFAULT_SUCCESS_CODE)) {
                throw new RuntimeException("sso certificate failure! Msg: " + res.getMsg());
            }
            return JSONUtil.parse(res.getData()).toBean(SsoAuthInfo.class);
        } catch (RestClientException e) {
            throw new RestClientException("sso certificate request error! Msg: " + e.getMessage());
        }
    }

    @Override
    public void sendSms(String phone, String code) {
        LOGGER.info("K11: Sending SMS, phone:{}", phone);
        try {
            Map<String, Object> map = new HashMap<>(3);
            map.put("phone", phone);
            map.put("temp_code", this.smsTempCode);
            JSONObject jsonObject = JSONUtil.createObj();
            jsonObject.set("code", code);
            map.put("temp_param", jsonObject.toString());
            BaseResponse res = getRestTemplate().postForObject(this.domain + SMS_URL,
                    new HttpEntity<>(map, this.getHeader()), BaseResponse.class);
            assert res != null;
            if (!res.getCode().equals(DEFAULT_SUCCESS_CODE)) {
                throw new RuntimeException("Failed to send SMS! Msg: " + res.getMsg());
            }
        } catch (RestClientException e) {
            throw new RestClientException("Send SMS API request error! Msg: " + e.getMessage());
        }
    }

    private EncryptKey getEncryptKey(HttpHeaders headers) {
        try {
            BaseResponse res = getRestTemplate().postForObject(this.domain + ENCRYPT_KEY_URL,
                    new HttpEntity<>(headers), BaseResponse.class);
            assert res != null;
            if (!res.getCode().equals(DEFAULT_SUCCESS_CODE)) {
                throw new RuntimeException("Failed to get key! Msg: " + res.getMsg());
            }
            return JSONUtil.parse(res.getData()).toBean(EncryptKey.class);
        } catch (RestClientException e) {
            throw new RestClientException("Get key request error! Msg: " + e.getMessage());
        }
    }

    private HttpHeaders getHeader() {
        HttpHeaders headers = new HttpHeaders();

        headers.set("app-id", this.appId);
        long timestamp = Clock.systemDefaultZone().millis()/1000;
        headers.set("timestamp", String.valueOf(timestamp));

        // after sorting in ascending order query_string, then urldecode, and finally sh1 encrypted and converted to uppercase
        String param = StrUtil.format("app_id={}&app_secret={}&timestamp={}", this.appId,  this.appSecret, timestamp - 3600);
        String sign = SecureUtil.sha1(URLUtil.decode(param)).toUpperCase();
        headers.set("sign", sign);

        // signature parameter plus signature, signParam['sign'] = sign, md5 after query_string
        headers.set("access-token", SecureUtil.md5(StrUtil.format("{}&sign={}", param, sign)));

        return headers;
    }
}
