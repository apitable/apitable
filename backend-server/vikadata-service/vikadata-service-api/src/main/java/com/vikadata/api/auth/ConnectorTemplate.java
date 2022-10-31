package com.vikadata.api.auth;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.context.SessionContext;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.connector.k11.K11Connector;
import com.vikadata.connector.k11.model.SsoAuthInfo;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.UserEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * connector template
 * </p>
 *
 * @author Chambers
 */
@Slf4j
@Component
public class ConnectorTemplate {

    @Autowired(required = false)
    private K11Connector k11Connector;

    @Resource
    private IUserService iUserService;

    public void loginBySsoToken(String token){
        log.info("sso token 「{}」Login", token);
        if (k11Connector != null) {
            try {
                SsoAuthInfo authInfo = k11Connector.loginBySsoToken(token);
                // The phone number may be a landline, so automatic binding is not required
                UserEntity user = iUserService.getByEmail(authInfo.getEmailAddr());
                if (user != null) {
                    iUserService.updateLoginTime(user.getId());
                    SessionContext.setUserId(user.getId());
                    return;
                }
                Long registerUserId = iUserService.create(null, null,
                    authInfo.getUserDisplayName(), null, authInfo.getEmailAddr(),"");
                SessionContext.setUserId(registerUserId);
                return;
            }
            catch (Exception e) {
                log.error("sso token「{}」login error, msg:{}", token, e.getMessage());
                throw new BusinessException("SSO login error");
            }
        }
        throw new BusinessException("This environment does not support SSO login");

    }

    public Long loginBySso(String username, String credential) {
        log.info("user「{}」login", username);
        if (k11Connector != null) {
            try {
                SsoAuthInfo authInfo = k11Connector.loginBySso(username, credential);
                UserEntity user = iUserService.getByEmail(authInfo.getEmailAddr());
                if (user != null) {
                    iUserService.updateLoginTime(user.getId());
                    return user.getId();
                }
                return iUserService.create(null, null,
                        authInfo.getUserDisplayName(), null, authInfo.getEmailAddr(),"");
            } catch (Exception e) {
                log.error("sso user「{}」login error, msg:{}", username, e.getMessage());
                throw new BusinessException("SSO login error");
            }
        }
        throw new BusinessException("This environment does not support SSO login");
    }

    public void sendSms(String target, String code) {
        if (k11Connector != null) {
            try {
                k11Connector.sendSms(target, code);
            } catch (Exception e) {
                throw new BusinessException("send sms message error");
            }
            return;
        }
        throw new BusinessException("SMS service is not enabled");
    }
}
