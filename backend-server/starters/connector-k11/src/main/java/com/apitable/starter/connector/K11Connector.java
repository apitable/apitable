package com.apitable.starter.connector;

import com.apitable.starter.connector.k11.model.SsoAuthInfo;

/**
 * <p>
 * K11 Connector
 * </p>
 */
public interface K11Connector {

    SsoAuthInfo loginBySsoToken(String token);

    SsoAuthInfo loginBySso(String email, String password);

    void sendSms(String phone, String code) throws Exception;
}
