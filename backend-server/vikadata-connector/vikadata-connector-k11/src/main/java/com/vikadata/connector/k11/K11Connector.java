package com.vikadata.connector.k11;

import com.vikadata.connector.k11.model.SsoAuthInfo;

/**
 * <p>
 * 新世界 k11 连接器
 * </p>
 *
 * @author Chambers
 * @date 2021/6/19
 */
public interface K11Connector {

    SsoAuthInfo loginBySsoToken(String token);

    SsoAuthInfo loginBySso(String email, String password);

    void sendSms(String phone, String code) throws Exception;
}
